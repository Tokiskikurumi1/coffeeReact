import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // ❌ không scroll
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  return (
    <>
      <nav className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fa-solid fa-coffee logo-icon"></i>
            <span className="logo-text">Admin Coffee</span>
          </div>

          <button className="close-btn" onClick={closeSidebar}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link
              to="/admin/dashboard"
              onClick={closeSidebar}
              className={
                location.pathname === "/admin/dashboard" ? "active" : ""
              }
            >
              <i className="fa-solid fa-box"></i>
              <span>Quản lý sản phẩm</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/bills"
              onClick={closeSidebar}
              className={location.pathname === "/admin/bills" ? "active" : ""}
            >
              <i className="fa-solid fa-receipt"></i>
              <span>Quản lý hóa đơn</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/customers"
              onClick={closeSidebar}
              className={
                location.pathname === "/admin/customers" ? "active" : ""
              }
            >
              <i className="fa-solid fa-users"></i>
              <span>Quản lý khách hàng</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/report"
              onClick={closeSidebar}
              className={location.pathname === "/admin/report" ? "active" : ""}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>Báo cáo doanh thu</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/staff"
              onClick={closeSidebar}
              className={location.pathname === "/admin/staff" ? "active" : ""}
            >
              <i className="fa-solid fa-user-tie"></i>
              <span>Quản lý nhân viên</span>
            </Link>
          </li>

          <li className="logout-item">
            <Link to="/login">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Overlay */}
      {isOpen && <div className="overlay active" onClick={closeSidebar}></div>}

      {/* Button mở sidebar mobile */}
      <button
        className={`open-sidebar-btn ${isOpen ? "hide" : ""}`}
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
    </>
  );
}
