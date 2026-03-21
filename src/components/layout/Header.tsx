import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setCurrentUser(user);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setCurrentUser(null);
    navigate("/"); // về trang chủ
    window.location.reload(); // giống JS cũ
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div id="header">
      <div className="login-table">
        {currentUser ? (
          <span>
            Chào mừng: <Link to="/profile">{currentUser}</Link> |
            <Link to="/#" onClick={handleLogout}>
              Đăng xuất
            </Link>
          </span>
        ) : (
          <span>
            <Link to="/login">Đăng nhập</Link>
          </span>
        )}
      </div>

      <div className="tabbar-control">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="logo" />
        </Link>
        <i
          className="fa-solid fa-bars"
          id="menu-icon-home"
          onClick={toggleMenu}
        ></i>
        <ul className={`ul-bar ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/intro" onClick={() => setMenuOpen(false)}>
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setMenuOpen(false)}>
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Liên hệ
            </Link>
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
