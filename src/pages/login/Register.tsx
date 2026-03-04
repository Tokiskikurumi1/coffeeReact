import { useState } from "react";
// import "./login.css";

const API_BASE = "https://localhost:7161/api";

export default function Register() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !username || !password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    if (!agree) {
      alert("Vui lòng đồng ý điều khoản!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          PasswordHash: password,
          FullName: fullName,
          Email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message || "Đăng ký thành công!");
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server");
    }
  };

  return (
    <form
      className="register-form"
      onSubmit={handleRegister}
      autoComplete="off"
    >
      <div className="input-box">
        <input
          type="text"
          className="input-field"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label className="label">Tên người dùng</label>
      </div>

      <div className="input-box">
        <input
          type="text"
          className="input-field"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="label">Email</label>
      </div>

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

      <div className="form-cols">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <label> Tôi đồng ý với các điều khoản</label>
      </div>

      <div className="input-box">
        <button className="btn-submit">Đăng ký</button>
      </div>
    </form>
  );
}
