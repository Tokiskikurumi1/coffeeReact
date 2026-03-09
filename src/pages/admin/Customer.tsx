import { useEffect, useState } from "react";
import "./Customer.css";
import "./base.css";

const API_BASE = "https://localhost:7114/api/ManageCustomer";

export default function Customer() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [customerDetail, setCustomerDetail] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // ================= LOAD =================

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-all-customer`);

      if (!res.ok) throw new Error();

      const data = await res.json();

      setCustomers(data);
      setAllCustomers(data);
    } catch {
      console.log("Lỗi load khách hàng");
    }
  };

  // ================= HELPER =================

  const displayValue = (value: any) => {
    if (!value || value === "null") return "Chưa cập nhật";
    return value;
  };

  const formatMoney = (number: number) => {
    if (!number) return "Chưa có";
    return number.toLocaleString("vi-VN") + " đ";
  };

  // ================= FILTER =================

  const applyFilter = () => {
    let filtered = allCustomers;

    if (searchName) {
      filtered = filtered.filter((c) =>
        c.fullName?.toLowerCase().includes(searchName.toLowerCase()),
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter((c) => c.status.toString() === statusFilter);
    }

    setCustomers(filtered);
  };

  const resetFilter = () => {
    setSearchName("");
    setStatusFilter("");
    setCustomers(allCustomers);
  };

  // ================= VIEW DETAIL =================

  const viewCustomerDetail = async (userID: number) => {
    try {
      const res = await fetch(`${API_BASE}/get-customer-detail/${userID}`);

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (!data || data.length === 0) {
        alert("Không có dữ liệu khách hàng");
        return;
      }

      setCustomerDetail(data[0]);
      setShowModal(true);
    } catch {
      alert("Lỗi tải chi tiết khách hàng");
    }
  };

  // ================= UPDATE STATUS =================

  const updateStatus = async (userID: number, status: number) => {
    const confirmText =
      status === 0
        ? "Bạn có chắc muốn KHÓA tài khoản này?"
        : "Bạn có chắc muốn MỞ KHÓA tài khoản này?";

    if (!confirm(confirmText)) return;

    try {
      const res = await fetch(`${API_BASE}/update-status/${userID}/${status}`, {
        method: "PUT",
      });

      const message = await res.text();

      if (!res.ok) throw new Error(message);

      alert(message);

      loadCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ================= UI =================

  return (
    <div id="right-content">
      <main className="admin-main">
        <section className="customers-card">
          <h2>
            <i className="fas fa-users"></i> Quản lý khách hàng
          </h2>

          {/* FILTER */}

          <div className="filter-bar">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Tìm theo tên khách hàng..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                }}
              />
            </div>

            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Đã khóa</option>
              </select>
            </div>

            <div className="filter-group" style={{ flexDirection: "row" }}>
              <button className="btn-primary" onClick={applyFilter}>
                <i className="fas fa-filter"></i> Lọc
              </button>

              <button className="btn-secondary" onClick={resetFilter}>
                <i className="fas fa-rotate-left"></i> Reset
              </button>
            </div>
          </div>

          {/* TABLE */}

          <div className="table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Tổng giá trị hóa đơn</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: 40 }}
                    >
                      Chưa có khách hàng
                    </td>
                  </tr>
                ) : (
                  customers.map((c, index) => (
                    <tr key={c.userID}>
                      <td>{index + 1}</td>

                      <td>{displayValue(c.fullName)}</td>

                      <td>{displayValue(c.phone)}</td>

                      <td>{displayValue(c.address)}</td>

                      <td>{formatMoney(c.totalSpent)}</td>

                      <td className="action-icons">
                        <i
                          className="fa-solid fa-eye"
                          onClick={() => viewCustomerDetail(c.userID)}
                        ></i>

                        {c.status === 1 ? (
                          <i
                            className="fas fa-lock-open status-active"
                            title="Click để khóa"
                            onClick={() => updateStatus(c.userID, 0)}
                          ></i>
                        ) : (
                          <i
                            className="fas fa-lock status-locked"
                            title="Click để mở khóa"
                            onClick={() => updateStatus(c.userID, 1)}
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}

      {showModal && customerDetail && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <h3>Thông tin khách hàng</h3>

            <p>
              <strong>Tên khách hàng:</strong>{" "}
              {displayValue(customerDetail.fullName)}
            </p>

            <p>
              <strong>Giới tính:</strong> {displayValue(customerDetail.gender)}
            </p>

            <p>
              <strong>Địa chỉ:</strong> {displayValue(customerDetail.address)}
            </p>

            <p>
              <strong>Số điện thoại:</strong>{" "}
              {displayValue(customerDetail.phone)}
            </p>

            <p>
              <strong>Email:</strong> {displayValue(customerDetail.email)}
            </p>

            <p>
              <strong>Ngày tạo:</strong>{" "}
              {customerDetail.createdAt
                ? new Date(customerDetail.createdAt).toLocaleDateString()
                : "Chưa cập nhật"}
            </p>

            <p>
              <strong>Trạng thái:</strong>{" "}
              {customerDetail.status === 1 ? "Đang hoạt động" : "Đã bị khóa"}
            </p>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
