import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./sidebarStaff.css";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShow(!show);

    document.body.style.overflow = !show ? "hidden" : "auto";
  };

  const closeSidebar = () => {
    setShow(false);
    document.body.style.overflow = "auto";
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className={`staff-sidebar ${show ? "show" : ""}`}>
        <h3 className="sidebar-title">☕ Coffee Staff</h3>

        <Link
          to="/staff/dashboard"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          Dashboard
        </Link>

        <Link to="/staff/bills" className="sidebar-link" onClick={closeSidebar}>
          Quản lý hóa đơn
        </Link>

        <button className="sidebar-link logout-btn" onClick={logout}>
          Đăng xuất
        </button>
      </div>

      <div
        className={`sidebar-overlay ${show ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      <i className="fa-solid fa-bars menu-toggle" onClick={toggleSidebar}></i>
    </>
  );
}
