import React from "react";

type Props = {
  avatarUrl: string;
  fullName: string;
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  showOrders: boolean;
  setShowOrders: (val: boolean) => void;
  renderOrders: (status: string) => void;
  logout: () => void;
};

export default function SidebarCustomer({
  avatarUrl,
  fullName,
  sidebarOpen,
  setSidebarOpen,
  showOrders,
  setShowOrders,
  renderOrders,
  logout,
}: Props) {
  return (
    <>
      <section className={`sidebar-profile ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header-profile">
          <div className="avatar">
            <img className="img-avt" src={avatarUrl || "/images/user.jpg"} />
          </div>

          <h2 className="sidebar-name">{fullName}</h2>
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
    </>
  );
}
