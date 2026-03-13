import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://localhost:7161/api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          PasswordHash: password,
        }),
      });

      const data = await res.json(); // parse JSON trước

      if (!res.ok) {
        alert(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      // lưu localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", data.user);

      alert("Đăng nhập thành công");

      // =====================
      // CHECK ROLE
      // =====================

      if (data.role === "Nhân viên") {
        navigate("/staff/dashboard");
      } else if (data.role === "Khách hàng") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin} autoComplete="off">
      <div className="input-box">
        <input
          type="text"
          className="input-field"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="label">Tài khoản</label>
      </div>

      <div className="input-box">
        <input
          type="password"
          className="input-field"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="label">Mật khẩu</label>
      </div>

      <div className="input-box">
        <button className="btn-submit">Đăng nhập</button>
      </div>
    </form>
  );
}
