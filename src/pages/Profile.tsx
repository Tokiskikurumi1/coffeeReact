import { useEffect, useState } from "react";
import "./profile.css";

const API = "https://localhost:7027/api/Customer";
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
    const res = await fetch(`${API}/get-profile`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    setProfile(data);

    if (data.avatar) {
      setAvatarUrl(data.avatar);
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

      const uploadRes = await fetch(`${API}/customer-upload-image`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

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

    const res = await fetch(`${API}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    const message = await res.text();

    alert(message);

    loadProfile();
    setAvatarPreview("");
    setAvatarFile(null);
  };

  // ================= LOAD ORDERS =================
  const renderOrders = async (orderStatus = "All") => {
    const res = await fetch(`${API}/get-orders?status=${orderStatus}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    setOrders(data);
  };

  const filterOrders = (st: string) => {
    setStatus(st);
    renderOrders(st);
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (billId: number) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

    const res = await fetch(`${API}/cancel-order/${billId}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const message = await res.text();

    alert(message);

    renderOrders(status);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  // ================= FORMAT =================
  const formatMoney = (number: number) =>
    Number(number).toLocaleString("vi-VN") + "đ";

  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN");

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
          <section className={`sidebar-profile ${sidebarOpen ? "active" : ""}`}>
            <div className="sidebar-header-profile">
              <div className="avatar">
                <img
                  className="img-avt"
                  src={
                    avatarUrl
                      ? BASE_URL + avatarUrl
                      : "https://i.pravatar.cc/200"
                  }
                />
              </div>

              <h2 className="sidebar-name">{profile.fullName}</h2>
            </div>

            <ul className="sidebar-menu">
              <li>
                <a
                  className={!showOrders ? "active" : ""}
                  onClick={() => {
                    setShowOrders(false);
                    setSidebarOpen(false);
                  }}
                >
                  <i className="fas fa-user-circle"></i> Thông tin cá nhân
                </a>
              </li>

              <li>
                <a
                  className={showOrders ? "active" : ""}
                  onClick={() => {
                    setShowOrders(true);
                    renderOrders("All");
                    setSidebarOpen(false);
                  }}
                >
                  <i className="fas fa-receipt"></i> Hóa đơn của tôi
                </a>
              </li>

              <li>
                <a onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </a>
              </li>
            </ul>
          </section>
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
                      src={
                        avatarPreview
                          ? avatarPreview
                          : avatarUrl
                            ? BASE_URL + avatarUrl
                            : "https://i.pravatar.cc/200"
                      }
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

                  {orders.map((o: any) => (
                    <div className="order-item" key={o.billID}>
                      <div className="order-header">
                        <strong>#{o.billID}</strong>

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

                      <div className="order-product">
                        <img src={PRODUCT_URL + o.imageURL} width="60" />

                        <span className="span-bill">
                          {o.coffeeName} x{o.quantity}
                        </span>

                        <span
                          className="span-bill"
                          style={{ marginLeft: "auto" }}
                        >
                          {formatMoney(o.subTotal)}
                        </span>
                      </div>

                      <p className="order-total">
                        <strong>{formatMoney(o.subTotal)}</strong>
                      </p>

                      {(o.status === 0 || o.status === 1) && (
                        <div className="order-actions">
                          <button
                            className="cancel-btn"
                            onClick={() => cancelOrder(o.billID)}
                          >
                            Hủy đơn
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
