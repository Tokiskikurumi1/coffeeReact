import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./sidebarStaff.css";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSidebar = () => {
    setShow(!show);
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [show]);
  useEffect(() => {
    if (show) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [show]);
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
          className={`sidebar-link ${
            location.pathname === "/staff/dashboard" ? "active" : ""
          }`}
          onClick={closeSidebar}
        >
          Tổng quan
        </Link>

        <Link
          to="/staff/requestBills"
          className={`sidebar-link ${
            location.pathname === "/staff/requestBills" ? "active" : ""
          }`}
          onClick={closeSidebar}
        >
          Quản lý hóa đơn
        </Link>
        <Link
          to="/staff/profileStaff"
          className={`sidebar-link ${
            location.pathname === "/staff/profile" ? "active" : ""
          }`}
          onClick={closeSidebar}
        >
          Tài khoản
        </Link>
        <button className="sidebar-link logout-btn" onClick={logout}>
          Đăng xuất
        </button>
      </div>

      <div
        className={`sidebar-overlay ${show ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Button mở sidebar mobile */}
      <button
        className={`menu-toggle ${show ? "hide" : ""}`}
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars" style={{ color: "#fff" }}></i>
      </button>
    </>
  );
}
