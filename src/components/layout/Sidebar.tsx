import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fa-solid fa-coffee logo-icon"></i>
            <span className="logo-text">Admin Coffee</span>
          </div>

          <button className="close-btn" id="closeSidebar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/admin/dashboard" className="active">
              <i className="fa-solid fa-box"></i>
              <span>Quản lý sản phẩm</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/bills">
              <i className="fa-solid fa-receipt"></i>
              <span>Quản lý hóa đơn</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/customers">
              <i className="fa-solid fa-users"></i>
              <span>Quản lý khách hàng</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/Report">
              <i className="fa-solid fa-chart-line"></i>
              <span>Báo cáo doanh thu</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/staff">
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

      <div className="overlay" id="overlay"></div>
    </>
  );
}
