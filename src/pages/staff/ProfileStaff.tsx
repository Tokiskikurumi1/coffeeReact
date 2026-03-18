import { useEffect, useState } from "react";
import "./profilestaff.css";

const API_PROFILE = "https://localhost:7203/api/Account/get-my-profile";
const API_UPDATE = "https://localhost:7203/api/Account/update-profile";
const API_CHANGE_PASS = "https://localhost:7203/api/Account/change-password";

interface Profile {
  username: string;
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export default function ProfileStaff() {
  const [profile, setProfile] = useState<Profile>({
    username: "",
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ================= GET PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await fetch(API_PROFILE, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      const data: Profile = await res.json();

      setProfile(data);
    } catch (err) {
      console.error("Lỗi lấy profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      const res = await fetch(API_UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          gender: profile.gender,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
        }),
      });

      const data = await res.json();

      alert(data.message);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Lỗi update:", err);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    fetch(API_CHANGE_PASS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setShowModal(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      });
  };

  return (
    <div
      className="page-content"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="profile-header">
        <h2>Thông tin cá nhân</h2>
      </div>

      <div className="profile-card">
        <div className="form-group">
          <label>Username</label>
          <input value={profile.username || ""} disabled />
        </div>

        <div className="form-group">
          <label>Họ tên</label>
          <input
            value={profile.fullName || ""}
            disabled={!editing}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <input
            value={profile.gender || ""}
            disabled={!editing}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>SĐT</label>
          <input
            value={profile.phone || ""}
            disabled={!editing}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            value={profile.email || ""}
            disabled={!editing}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            value={profile.address || ""}
            disabled={!editing}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
          />
        </div>

        <div className="profile-actions">
          {!editing ? (
            <button onClick={() => setEditing(true)}>Chỉnh sửa</button>
          ) : (
            <>
              <button onClick={handleUpdate}>Lưu</button>
              <button onClick={() => setEditing(false)}>Hủy</button>
            </>
          )}

          <button onClick={() => setShowModal(true)}>Đổi mật khẩu</button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-changePass">
            <h3>Đổi mật khẩu</h3>

            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={handleChangePassword}>Xác nhận</button>
              <button onClick={() => setShowModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
