import { useEffect, useState } from "react";
import "./Bill.css";
import "./base.css";

const API_BASE = "https://localhost:7114/api/Bill";

export default function Bills() {
  const [bills, setBills] = useState<any[]>([]);
  const [allBills, setAllBills] = useState<any[]>([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRange, setTotalRange] = useState("");

  const [billDetail, setBillDetail] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // ================= LOAD BILL =================

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-all-bill`);
      const data = await res.json();

      setBills(data);
      setAllBills(data);
    } catch {
      console.log("Lỗi load hóa đơn");
    }
  };

  // ================= FORMAT =================

  const formatMoney = (number: number) => {
    return number.toLocaleString("vi-VN") + " đ";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // ================= VIEW DETAIL =================

  const viewBillDetail = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/get-bill-by-id/${id}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        alert("Không tìm thấy hóa đơn");
        return;
      }

      setBillDetail(data);
      setShowModal(true);
    } catch {
      console.log("Lỗi load chi tiết hóa đơn");
    }
  };

  // ================= DELETE =================

  const deleteBill = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa hóa đơn?")) return;

    try {
      const res = await fetch(`${API_BASE}/delete-bill/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Xóa thành công");
        loadBills();
      } else {
        alert("Xóa thất bại");
      }
    } catch {
      console.log("Lỗi delete bill");
    }
  };

  // ================= FILTER =================

  const filterBills = () => {
    const filtered = allBills.filter((bill) => {
      const billDate = new Date(bill.billDate);
      const billTotal = bill.totalAmount;

      let show = true;

      if (fromDate && new Date(fromDate) > billDate) show = false;
      if (toDate && new Date(toDate) < billDate) show = false;

      if (totalRange) {
        if (totalRange === "0-100000" && !(billTotal <= 100000)) show = false;

        if (
          totalRange === "100000-300000" &&
          !(billTotal > 100000 && billTotal <= 300000)
        )
          show = false;

        if (
          totalRange === "300000-500000" &&
          !(billTotal > 300000 && billTotal <= 500000)
        )
          show = false;

        if (totalRange === "500000+" && !(billTotal > 500000)) show = false;
      }

      return show;
    });

    setBills(filtered);
  };

  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setTotalRange("");
    setBills(allBills);
  };

  // ================= UI =================

  return (
    <div id="right-content">
      <main className="admin-main">
        <section className="bills-card">
          <h2>
            <i className="fas fa-receipt"></i> Quản lý hóa đơn
          </h2>

          {/* FILTER */}

          <div className="filter-bar">
            <div className="filter-group">
              <label>Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Mức tổng tiền</label>

              <select
                value={totalRange}
                onChange={(e) => setTotalRange(e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                <option value="0-100000">0đ - 100.000đ</option>
                <option value="100000-300000">100.000đ - 300.000đ</option>
                <option value="300000-500000">300.000đ - 500.000đ</option>
                <option value="500000+">Trên 500.000đ</option>
              </select>
            </div>

            <div className="filter-actions">
              <button className="btn-primary" onClick={filterBills}>
                <i className="fas fa-filter"></i> Lọc
              </button>

              <button className="btn-secondary" onClick={resetFilter}>
                <i className="fas fa-rotate-left"></i> Reset
              </button>
            </div>
          </div>

          {/* TABLE */}

          <div className="table-container">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã hóa đơn</th>
                  <th>Ngày lập</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {bills.map((bill, index) => (
                  <tr key={bill.billID}>
                    <td>{index + 1}</td>

                    <td>#{bill.billID}</td>

                    <td>{formatDate(bill.billDate)}</td>

                    <td>{formatMoney(bill.totalAmount)}</td>

                    <td>
                      {bill.status === 1 ? "Đã thanh toán" : "Chưa thanh toán"}
                    </td>

                    <td className="actions-icons">
                      <i
                        className="fas fa-eye action-icon view"
                        onClick={() => viewBillDetail(bill.billID)}
                      ></i>

                      <i
                        className="fas fa-trash action-icon delete"
                        onClick={() => deleteBill(bill.billID)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}

      {showModal && billDetail.length > 0 && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </span>

            <h2>
              <i className="fas fa-file-invoice-dollar"></i> Chi tiết hóa đơn #
              {billDetail[0].billID}
            </h2>

            <div className="bill-info">
              <p>
                <strong>Ngày lập:</strong> {formatDate(billDetail[0].billDate)}
              </p>

              <p>
                <strong>Khách hàng:</strong> {billDetail[0].fullName}
              </p>

              <p>
                <strong>SĐT:</strong> {billDetail[0].phone}
              </p>

              <p>
                <strong>Tổng tiền:</strong>{" "}
                {formatMoney(billDetail[0].totalAmount)}
              </p>
            </div>

            <table className="detail-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>

              <tbody>
                {billDetail.map((item, index) => (
                  <tr key={index}>
                    <td>{item.coffeeName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatMoney(item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 15 }}>
              Tổng tiền: {formatMoney(billDetail[0].totalAmount)}
            </div>

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
