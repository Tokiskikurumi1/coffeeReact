import { useEffect, useState } from "react";
import "./Bill.css";
import "./base.css";
import { BillAPI } from "../../services/AdminAPI";

export default function Bills() {
  const [bills, setBills] = useState<any[]>([]);
  const [allBills, setAllBills] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRange, setTotalRange] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const bill = products[0];

  /* ================= LOAD BILL ================= */
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const res = await BillAPI.getAll();
      const data = await res.json();
      setBills(data);
      setAllBills(data);
    } catch {
      console.log("Lỗi load hóa đơn");
    }
  };

  /* ================= VIEW DETAIL ================= */
  const viewBillDetail = async (id: number) => {
    try {
      const res = await BillAPI.getById(id);
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.products) {
        alert("Không tìm thấy hóa đơn");
        return;
      }
      setProducts(data.products);
      setLogs(data.logs || []);
      setShowModal(true);
    } catch {
      console.log("Lỗi chi tiết hóa đơn");
    }
  };

  /* ================= DELETE ================= */
  const deleteBill = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) return;
    try {
      const res = await BillAPI.delete(id);
      if (res.ok) {
        alert("Xóa thành công");
        loadBills();
      } else {
        alert("Xóa thất bại");
      }
    } catch {
      console.log("Lỗi xóa hóa đơn");
    }
  };

  /* ================= STATUS ================= */

  const getStatusText = (status: any) => {
    switch (status) {
      case 1:
        return "Chờ xác nhận";
      case 2:
        return "Chờ giao";
      case 3:
        return "Đã giao";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  /* ================= FORMAT ================= */

  const formatMoney = (number: any) => {
    return number.toLocaleString("vi-VN") + " đ";
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatTime = (date: any) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAction = (action: any) => {
    switch (action) {
      case "CONFIRM":
        return "xác nhận đơn";
      case "SHIPPING":
        return "đang giao hàng";
      case "DELIVERED":
        return "giao thành công";
      case "CANCEL":
        return "hủy đơn";
      default:
        return action;
    }
  };

  /* ================= FILTER ================= */

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
    setPage(1);
  };

  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setTotalRange("");
    setBills(allBills);
    setPage(1);
  };

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(bills.length / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const currentBills = bills.slice(start, end);

  /* ================= UI ================= */

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
                {currentBills.map((bill, index) => (
                  <tr key={bill.billID}>
                    <td>{start + index + 1}</td>

                    <td>#{bill.billID}</td>

                    <td>{formatDate(bill.billDate)}</td>

                    <td>{formatMoney(bill.totalAmount)}</td>

                    <td>{getStatusText(bill.status)}</td>

                    <td>
                      <i
                        style={{ marginRight: "5px" }}
                        className="fas fa-eye action-icon view"
                        onClick={() => viewBillDetail(bill.billID)}
                      ></i>

                      {/* <i
                        className="fas fa-trash action-icon delete"
                        onClick={() => deleteBill(bill.billID)}
                      ></i> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{ marginRight: 10, padding: "5px 10px" }}
              >
                {"<"}
              </button>

              <span style={{ fontWeight: "bold", margin: "0 10px" }}>
                Trang {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{ marginLeft: 10, padding: "5px 10px" }}
              >
                {">"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL */}

      {showModal && bill && (
        <>
          <div className="overlay" onClick={() => setShowModal(false)}></div>

          <div className="modal active">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </span>

              <h2>
                <i className="fas fa-file-invoice-dollar"></i>
                Chi tiết hóa đơn #{bill.billID}
              </h2>

              <div className="bill-info">
                <p>
                  <strong>Ngày lập:</strong> {formatDate(bill.billDate)}
                </p>

                <p>
                  <strong>Khách hàng:</strong> {bill.customerName}
                </p>

                <p>
                  <strong>SĐT:</strong> {bill.phone}
                </p>

                <p>
                  <strong>Tổng tiền:</strong> {formatMoney(bill.totalAmount)}
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
                  {products.map((item, i) => (
                    <tr key={i}>
                      <td>{item.coffeeName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatMoney(item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <span>Tổng tiền: {formatMoney(bill.totalAmount)}</span>

              <div className="bill-history">
                <h3>Lịch sử xử lý</h3>

                {logs.length === 0 ? (
                  <p>Chưa có lịch sử xử lý</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="history-item">
                      <span className="history-time">
                        {formatTime(log.actionTime)}
                      </span>

                      <span className="history-staff">{log.staffName}</span>

                      <span className="history-action">
                        {formatAction(log.actionType)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="modal-actions">
                <button
                  style={{ backgroundColor: "#6b4e31", color: "#fff" }}
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
