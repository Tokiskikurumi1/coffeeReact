import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "./billrequest.css"; // Giả sử bạn đã tạo file CSS này

const API_BASE = "https://localhost:7203/api/ManageBill";

// Định nghĩa kiểu dữ liệu cho một hóa đơn
interface Bill {
  billID: number;
  customerName: string;
  phone: string;
  billDate: string;
  status: number;
}

// Định nghĩa kiểu dữ liệu cho chi tiết sản phẩm trong hóa đơn
interface BillDetailProduct {
  coffeeName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  customerName: string;
  phone: string;
  address: string;
  status: number;
}

export default function ManageBill() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState<BillDetailProduct[] | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBillId, setCurrentBillId] = useState<number | null>(null);

  // State cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortTime, setSortTime] = useState("new");

  const prevMaxId = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const pageSize = 10;

  // --- Helpers ---
  const getToken = () => localStorage.getItem("accessToken");
  const formatPrice = (price: number) =>
    Number(price).toLocaleString("vi-VN") + "đ";

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Chờ xác nhận";
      case 2:
        return "Đang giao";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã huỷ";
      default:
        return "Không rõ";
    }
  };

  // --- API Calls ---
  const loadBills = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/get-all-bill`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Bill[] = await res.json();

      // ÉP React nhận state mới
      setBills([...data]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (billId: number, status: number) => {
    try {
      const token = getToken();
      const res = await fetch(
        `${API_BASE}/update-status?billId=${billId}&status=${status}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const msg = await res.text();
      alert(msg);
      closeModal();
      loadBills(); // Tải lại danh sách hóa đơn
    } catch (err) {
      console.error(err);
    }
  };

  // --- Effects ---
  useEffect(() => {
    loadBills(); // Tải dữ liệu lần đầu

    // Thiết lập một interval để kiểm tra hóa đơn mới mỗi 5 giây
    const interval = setInterval(() => {
      loadBills();
    }, 5000); // 5000ms = 5 giây

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, []);

  // *** LOGIC MỚI: Hiển thị toast khi có hóa đơn mới ***
  useEffect(() => {
    if (bills.length === 0) return;

    const currentMaxId = Math.max(...bills.map((b) => b.billID));

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevMaxId.current = currentMaxId;
      return;
    }

    if (prevMaxId.current !== null && currentMaxId > prevMaxId.current) {
      const toast = document.getElementById("orderToast");
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }
    }

    prevMaxId.current = currentMaxId;
  }, [bills]);

  useEffect(() => {
    let tempBills = [...bills];

    // Filter by status
    if (statusFilter !== "all") {
      const statusValue =
        statusFilter === "pending"
          ? 1
          : statusFilter === "processing"
            ? 2
            : statusFilter === "done"
              ? 3
              : 4;
      tempBills = tempBills.filter((b) => b.status === statusValue);
    }

    // Filter by search term
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();
      tempBills = tempBills.filter(
        (b) =>
          b.billID.toString().includes(keyword) ||
          b.customerName.toLowerCase().includes(keyword) ||
          b.phone.includes(keyword),
      );
    }

    // Filter by date
    if (fromDate || toDate) {
      tempBills = tempBills.filter((b) => {
        const billDate = new Date(b.billDate);
        if (fromDate && billDate < new Date(fromDate)) return false;
        if (toDate && billDate > new Date(toDate)) return false;
        return true;
      });
    }

    // Sort by time
    tempBills.sort((a, b) => {
      const dateA = new Date(a.billDate).getTime();
      const dateB = new Date(b.billDate).getTime();
      return sortTime === "new" ? dateB - dateA : dateA - dateB;
    });

    setFilteredBills(tempBills);
    setCurrentPage(1);
  }, [bills, searchTerm, statusFilter, fromDate, toDate, sortTime]);

  // --- Handlers ---
  const openDetail = async (id: number) => {
    try {
      setCurrentBillId(id);
      const token = getToken();
      const res = await fetch(`${API_BASE}/get-bill-detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: BillDetailProduct[] = await res.json();
      if (data && data.length > 0) {
        setSelectedBill(data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
    setCurrentBillId(null);
  };

  const resetFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setStatusFilter("all");
    setSortTime("new");
  };

  const exportBillPDF = (id: number) => {
    const { jsPDF } = window as any; // Hoặc import theo cách của thư viện
    const doc = new jsPDF();
    doc.text("KURUMI COFFEE", 105, 20, null, null, "center");
    doc.text("HÓA ĐƠN THANH TOÁN", 105, 30, null, null, "center");
    doc.text("Mã hóa đơn: " + id, 20, 50);
    doc.text("Ngày: " + new Date().toLocaleString(), 20, 60);
    // Thêm logic để lấy và thêm chi tiết sản phẩm vào PDF nếu cần
    doc.text("Cảm ơn quý khách!", 105, 100, null, null, "center");
    doc.save(`hoadon_${id}.pdf`);
  };

  const renderActionButtons = (status: number, billId: number) => {
    switch (status) {
      case 1:
        return (
          <>
            <button onClick={() => updateStatus(billId, 2)}>Xác nhận</button>
            <button onClick={() => updateStatus(billId, 4)}>Huỷ</button>
          </>
        );
      case 2:
        return (
          <>
            <button onClick={() => updateStatus(billId, 3)}>Đã giao</button>
            <button onClick={() => updateStatus(billId, 4)}>Huỷ</button>
            <button onClick={() => exportBillPDF(billId)}>Xuất hóa đơn</button>
          </>
        );
      default:
        return null;
    }
  };

  // --- Pagination Data ---
  const totalPages = Math.ceil(filteredBills.length / pageSize);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <div id="orderToast" className="order-toast">
        Đơn hàng mới vừa được tạo!
      </div>
      <div className="page-content">
        <div className="dashboard-header">
          <div className="header-title">
            <h2>
              <i className="fa-solid fa-receipt"></i>
              Quản lý hóa đơn
            </h2>
          </div>
        </div>

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="processing">Đang giao</option>
          <option value="done">Hoàn thành</option>
          <option value="cancel">Đã hủy</option>
        </select>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Tìm mã / khách / SĐT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label>Từ</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>Đến</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <select
            value={sortTime}
            onChange={(e) => setSortTime(e.target.value)}
          >
            <option value="new">Mới nhất</option>
            <option value="old">Cũ nhất</option>
          </select>
          <button className="btn-secondary" onClick={resetFilter}>
            <i className="fas fa-rotate-left"></i> Reset
          </button>
        </div>

        <div className="table-wrapper">
          <table className="bill-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách</th>
                <th>SĐT</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBills.map((bill) => (
                <tr key={bill.billID} onClick={() => openDetail(bill.billID)}>
                  <td>{bill.billID}</td>
                  <td>{bill.customerName}</td>
                  <td>{bill.phone}</td>
                  <td>{new Date(bill.billDate).toLocaleString()}</td>
                  <td>
                    <span className="status">{getStatusText(bill.status)}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {renderActionButtons(bill.status, bill.billID)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>

          <span className="page-info">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>

        {isModalOpen && selectedBill && (
          <div className="bill-modal" style={{ display: "flex" }}>
            <div className="bill-modal-content">
              <span className="close-modal" onClick={closeModal}>
                ×
              </span>
              <h2>Chi tiết đơn hàng</h2>
              <div className="detail-info">
                <p>
                  <b>Mã đơn:</b> {currentBillId}
                </p>
                <p>
                  <b>Khách:</b> {selectedBill[0].customerName}
                </p>
                <p>
                  <b>SĐT:</b> {selectedBill[0].phone}
                </p>
                <p>
                  <b>Địa chỉ:</b> {selectedBill[0].address}
                </p>
              </div>
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Món</th>
                    <th>SL</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.map((p, index) => (
                    <tr key={index}>
                      <td>{p.coffeeName}</td>
                      <td>{p.quantity}</td>
                      <td>{formatPrice(p.unitPrice)}</td>
                      <td>{formatPrice(p.subTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 className="detail-total">
                Tổng tiền:{" "}
                {formatPrice(
                  selectedBill.reduce((acc, item) => acc + item.subTotal, 0),
                )}
              </h3>
              <p>
                Trạng thái:{" "}
                <span className="status">
                  {getStatusText(selectedBill[0].status)}
                </span>
              </p>
              <div id="detailActions">
                {renderActionButtons(selectedBill[0].status, currentBillId!)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
