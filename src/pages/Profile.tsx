import { useEffect, useState } from "react";
import "./profile.css";
import SidebarCustomer from "../components/layout/SidebarCustomer";
import { CustomerProfileAPI } from "../services/CustomerAPI";
const BASE_URL = "https://localhost:7027";
const PRODUCT_URL = "https://localhost:7114";

export default function Profile() {
  const token = localStorage.getItem("accessToken");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const finalAvatar = avatarPreview || avatarUrl || "/images/user.jpg";
  const orderStatusList = [
    { value: "All", label: "Tất cả" },
    { value: "Pending", label: "Chờ xác nhận" },
    { value: "Shipping", label: "Đang giao" },
    { value: "Delivered", label: "Đã giao" },
    { value: "Cancelled", label: "Đã hủy" },
  ];
  // ================= TOGGLE SIDEBAR =================
  useEffect(() => {
    const body = document.body;

    if (sidebarOpen) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }

    return () => {
      body.classList.remove("no-scroll");
    };
  }, [sidebarOpen]);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await CustomerProfileAPI.getProfile();

    const data = await res.json();

    setProfile(data);

    if (data.avatar) {
      setAvatarUrl(BASE_URL + data.avatar);
    } else {
      setAvatarUrl("/images/user.jpg");
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e: any) => {
    setProfile({
      ...profile,
      [e.target.id]: e.target.value,
    });
  };

  // ================= UPLOAD AVATAR =================
  const previewAvatar = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();

    reader.onload = (ev: any) => {
      setAvatarPreview(ev.target.result);
    };

    reader.readAsDataURL(file);
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = async () => {
    let newAvatar = avatarUrl;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);

      const uploadRes = await CustomerProfileAPI.uploadAvatar(formData);

      if (!uploadRes.ok) {
        alert("Upload ảnh thất bại");
        return;
      }

      const uploadData = await uploadRes.json();
      newAvatar = uploadData.imageUrl;
    }

    const body = {
      fullName: profile.fullName,
      gender: profile.gender,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      passwordHash: profile.passwordHash,
      avatar: newAvatar,
    };

    const res = await CustomerProfileAPI.updateProfile(body);

    const message = await res.text();

    alert(message);

    loadProfile();
    setAvatarPreview("");
    setAvatarFile(null);
  };

  // ================= LOAD ORDERS =================
  const renderOrders = async (orderStatus = "All") => {
    const res = await CustomerProfileAPI.getOrders(orderStatus);

    const data = await res.json();

    setOrders(data);
  };

  const filterOrders = (st: string) => {
    setStatus(st);
    setCurrentPage(1); // Reset to first page when filtering
    renderOrders(st);
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (billId: number) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

    const res = await CustomerProfileAPI.cancelOrder(billId);

    const message = await res.text();

    alert(message);

    renderOrders(status);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ================= FORMAT =================
  const formatMoney = (number: number) =>
    Number(number).toLocaleString("vi-VN") + "đ";

  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN");

  const groupedBills = orders.reduce((acc: any, item: any) => {
    if (!acc[item.billID]) {
      acc[item.billID] = {
        billDate: item.billDate,
        status: item.status,
        statusName: item.statusName,
        products: [],
        total: 0,
      };
    }

    acc[item.billID].products.push(item);
    acc[item.billID].total += item.subTotal;

    return acc;
  }, {});

  const billIds = Object.keys(groupedBills);
  const totalPages = Math.ceil(billIds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBillIds = billIds.slice(startIndex, endIndex);
  return (
    <div className="container">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <i className="fas fa-bars"></i>
      </button>
      <div>
        <div className="container-profile">
          {/* SIDEBAR */}
          <SidebarCustomer
            avatarUrl={avatarUrl}
            fullName={profile.fullName}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            showOrders={showOrders}
            setShowOrders={setShowOrders}
            renderOrders={renderOrders}
            logout={logout}
          />
          <div
            className={`overlay ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          ></div>
          <main className="main-content">
            {/* PROFILE */}
            {!showOrders && (
              <div id="profile-info" className="profile-card">
                <h2>
                  <i className="fas fa-user-circle"></i> Thông tin cá nhân
                </h2>

                <div className="profile-layout">
                  <div className="profile-left">
                    <div className="info-grid">
                      <div className="info-item">
                        <label>
                          Tên đăng nhập:
                          <span className="userName">{profile.username}</span>
                        </label>
                      </div>

                      <div className="info-item">
                        <i className="fas fa-user"></i>
                        <input
                          id="fullName"
                          value={profile.fullName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="info-item">
                        <i className="fas fa-venus-mars"></i>
                        <select
                          id="gender"
                          value={profile.gender || ""}
                          onChange={handleChange}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </div>

                      <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <input
                          id="email"
                          value={profile.email || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <input
                          id="address"
                          value={profile.address || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="info-item">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          id="passwordHash"
                          value={profile.passwordHash || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="info-item">
                        <label>
                          Ngày tạo:
                          <span className="createdAt">
                            {formatDate(profile.createdAt)}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* AVATAR */}
                  <div className="profile-right">
                    <img
                      id="previewAvatar"
                      src={avatarPreview || avatarUrl || "/images/user.jpg"}
                    />

                    <input
                      type="file"
                      id="uploadAvatar"
                      hidden
                      onChange={previewAvatar}
                    />

                    <label htmlFor="uploadAvatar" className="choose-img">
                      Chọn ảnh
                    </label>
                  </div>
                </div>

                <div className="profile-save">
                  <button className="btn" onClick={updateProfile}>
                    <i className="fas fa-save"></i> Lưu thay đổi
                  </button>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {showOrders && (
              <div id="orders-section" className="profile-card">
                <h2>
                  <i className="fas fa-receipt"></i> Hóa đơn của tôi
                </h2>

                <div className="tab-bar">
                  {orderStatusList.map((s) => (
                    <div
                      key={s.value}
                      className={`tab ${status === s.value ? "active" : ""}`}
                      onClick={() => filterOrders(s.value)}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>

                <div id="order-list">
                  {orders.length === 0 && (
                    <p style={{ textAlign: "center", padding: 40 }}>
                      Chưa có đơn hàng
                    </p>
                  )}

                  {currentBillIds.map((billID: any) => {
                    const o = groupedBills[billID];

                    return (
                      <div className="order-item" key={billID}>
                        <div className="order-header">
                          <strong>Mã hóa đơn: {billID}</strong>

                          <span
                            className={`order-status ${
                              o.status === 0
                                ? "status-pending"
                                : o.status === 1
                                  ? "status-confirmed"
                                  : o.status === 2
                                    ? "status-shipping"
                                    : o.status === 3
                                      ? "status-delivered"
                                      : "status-cancelled"
                            }`}
                          >
                            {o.statusName}
                          </span>
                        </div>

                        <p>
                          <small>{formatDate(o.billDate)}</small>
                        </p>

                        {o.products.map((p: any, index: number) => (
                          <div className="order-product" key={index}>
                            <img src={PRODUCT_URL + p.imageURL} width="60" />

                            <span className="span-bill">
                              {p.coffeeName} x{p.quantity}
                            </span>

                            <span
                              className="span-bill"
                              style={{ marginLeft: "auto" }}
                            >
                              {formatMoney(p.subTotal)}
                            </span>
                          </div>
                        ))}

                        <p className="order-total">
                          <strong>{formatMoney(o.total)}</strong>
                        </p>

                        {(o.status === 0 || o.status === 1) && (
                          <div className="order-actions">
                            <button
                              className="cancel-btn"
                              onClick={() => cancelOrder(Number(billID))}
                            >
                              Hủy đơn
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {orders.length > 0 && (
                  <div className="pagination">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      {"<"}
                    </button>
                    <span>
                      Trang {currentPage} / {totalPages}
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
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
