import { useState } from "react";
import styles from "./login.module.css";

const API_BASE = "https://localhost:7161/api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [loginData, setLoginData] = useState({
    account: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    agree: false,
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.account || !loginData.password) {
      alert("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: loginData.account,
          PasswordHash: loginData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      // const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", data.user);

      alert("Đăng nhập thành công");
      if (data.role === "Khách hàng") {
        window.location.href = "/";
      } else if (data.role === "Nhân viên") {
        window.location.href = "/staff/dashboard";
      }
    } catch {
      alert("Không kết nối được server");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, username, password, agree } = registerData;

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
        headers: { "Content-Type": "application/json" },
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
      setIsRegister(false);
    } catch {
      alert("Không kết nối được server");
    }
  };

  return (
    <div className={styles.loginPage}>
      <a href="/" className={styles.iconLog}>
        <i className="fa-solid fa-arrow-left"></i>
        {/* <img src="/HomepageImage/home.png" alt="home" /> */}
      </a>

      <div
        className={styles.wrapper}
        style={{ height: isRegister ? "600px" : "500px" }}
      >
        <div className={styles.formHeader}>
          <div className={styles.titles}>
            <div
              className={styles.titleLogin}
              style={{
                top: isRegister ? "-60px" : "40%",
                opacity: isRegister ? 0 : 1,
              }}
            >
              Đăng nhập
            </div>

            <div
              className={styles.titleRegister}
              style={{
                top: isRegister ? "40%" : "-160%",
                opacity: isRegister ? 1 : 0,
              }}
            >
              Đăng ký
            </div>
          </div>
        </div>

        {/* LOGIN */}
        <form
          className={styles.loginForm}
          onSubmit={handleLogin}
          style={{
            left: isRegister ? "-50%" : "50%",
            opacity: isRegister ? 0 : 1,
          }}
        >
          <InputBox
            type="text"
            label="Tài khoản"
            value={loginData.account}
            onChange={(v) => setLoginData({ ...loginData, account: v })}
          />
          <InputBox
            type="password"
            label="Mật khẩu"
            value={loginData.password}
            onChange={(v) => setLoginData({ ...loginData, password: v })}
          />

          <button className={styles.btnSubmit}>Đăng nhập</button>

          <div className={styles.switchForm}>
            Chưa có tài khoản?{" "}
            <span onClick={() => setIsRegister(true)}>Đăng ký</span>
          </div>
        </form>

        {/* REGISTER */}
        <form
          className={styles.registerForm}
          onSubmit={handleRegister}
          style={{
            left: isRegister ? "50%" : "150%",
            opacity: isRegister ? 1 : 0,
          }}
        >
          <InputBox
            type="text"
            label="Tên người dùng"
            onChange={(v) => setRegisterData({ ...registerData, fullName: v })}
          />
          <InputBox
            type="text"
            label="Email"
            onChange={(v) => setRegisterData({ ...registerData, email: v })}
          />
          <InputBox
            type="text"
            label="Tài khoản"
            onChange={(v) => setRegisterData({ ...registerData, username: v })}
          />
          <InputBox
            type="password"
            label="Mật khẩu"
            onChange={(v) => setRegisterData({ ...registerData, password: v })}
          />

          <div className={styles.formCols}>
            <input
              type="checkbox"
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  agree: e.target.checked,
                })
              }
            />{" "}
            Tôi đồng ý với các điều khoản
          </div>

          <button className={styles.btnSubmit}>Đăng ký</button>

          <div className={styles.switchForm}>
            Đã có tài khoản?{" "}
            <span onClick={() => setIsRegister(false)}>Login</span>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputBox({
  type,
  label,
  value,
  onChange,
}: {
  type: string;
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.inputBox}>
      <input
        type={type}
        className={styles.inputField}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label className={styles.label}>{label}</label>
    </div>
  );
}
