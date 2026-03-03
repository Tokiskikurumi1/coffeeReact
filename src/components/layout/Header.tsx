import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div id="header">
      <div className="login-table">
        <span>
          <Link to="/login">Đăng nhập</Link>
        </span>
      </div>

      <div className="tabbar-control">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="logo" />
        </Link>

        <ul className="ul-bar">
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/intro">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/products">Sản phẩm</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>

        <div className="search-basket">
          <Link to="/cart">
            <i className="fa-solid fa-basket-shopping"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
