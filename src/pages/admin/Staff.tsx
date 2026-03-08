import { useEffect, useState } from "react";
import "./staff.css";
import "./base.css";

const API = "https://localhost:7114/api/ManageStaff";

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  // ================= LOAD STAFF =================

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await fetch(`${API}/load-staff`);
      const data = await res.json();
      setStaffList(data);
    } catch {
      alert("Không thể tải danh sách nhân viên");
    }
  };

  // ================= FORMAT DATE =================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  // ================= VALIDATE =================

  const validateStaff = () => {
    if (!form.fullName) return alert("Tên không được trống");
    if (!form.gender) return alert("Chọn giới tính");
    if (!/^[0-9]{10}$/.test(form.phone)) return alert("SĐT phải 10 số");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return alert("Email không hợp lệ");

    return true;
  };

  // ================= ADD STAFF =================

  const addStaff = async () => {
    if (!validateStaff()) return;

    const res = await fetch(`${API}/add-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const message = await res.text();
    alert(message);

    if (res.ok) {
      loadStaff();
      resetForm();
    }
  };

  // ================= EDIT STAFF =================

  const openEdit = async (id: number) => {
    const res = await fetch(`${API}/detail/${id}`);
    const data = await res.json();

    const staff = data[0];

    setForm({
      username: staff.username,
      passwordHash: staff.passwordHash,
      fullName: staff.fullName,
      gender: staff.gender,
      phone: staff.phone,
      email: staff.email,
      address: staff.address,
    });

    setEditId(id);
    setShowModal(true);
  };

  const saveStaff = async () => {
    if (!validateStaff()) return;

    const res = await fetch(`${API}/update-staff/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const message = await res.text();
    alert(message);

    if (res.ok) {
      setShowModal(false);
      loadStaff();
    }
  };

  // ================= CHANGE STATUS =================

  const changeStatus = async (id: number, current: number) => {
    const newStatus = current === 1 ? 0 : 1;

    const res = await fetch(`${API}/update-status/${id}?status=${newStatus}`, {
      method: "PUT",
    });

    const message = await res.text();
    alert(message);

    if (res.ok) loadStaff();
  };

  // ================= DELETE STAFF =================

  const deleteStaff = async (id: number) => {
    if (!window.confirm("Bạn chắc muốn xóa?")) return;

    const res = await fetch(`${API}/delete-staff/${id}`, {
      method: "DELETE",
    });

    const message = await res.text();
    alert(message);

    if (res.ok) loadStaff();
  };

  const resetForm = () => {
    setForm({
      username: "",
      passwordHash: "",
      fullName: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  return (
    <div id="right-content">
      <main className="admin-main">
        <div className="staff-card">
          <h2>Quản lý nhân viên</h2>

          {/* ADD STAFF */}

          <div className="staff-form">
            <div className="form-staff-group">
              <label htmlFor="">Tên nhân viên</label>
              <input
                id="fullName"
                placeholder="Tên nhân viên"
                onChange={handleChange}
              />
            </div>
            <div className="form-staff-group">
              <label htmlFor="gender">Giới tính</label>
              <select id="gender" onChange={handleChange}>
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div className="form-staff-group">
              <label htmlFor="phone">SĐT</label>
              <input id="phone" placeholder="SĐT" onChange={handleChange} />
            </div>
            <div className="form-staff-group">
              <label htmlFor="email">Email</label>
              <input id="email" placeholder="Email" onChange={handleChange} />
            </div>
            <div className="form-staff-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                placeholder="Địa chỉ"
                onChange={handleChange}
              />
            </div>
            <div className="form-staff-group">
              <label htmlFor="username">Tài khoản</label>
              <input
                id="username"
                placeholder="Tài khoản"
                onChange={handleChange}
              />
            </div>
            <div className="form-staff-group">
              <label htmlFor="passwordHash">Mật khẩu</label>
              <input
                id="passwordHash"
                type="password"
                placeholder="Mật khẩu"
                onChange={handleChange}
              />
            </div>

            <div className="form-staff-group">
              <label htmlFor="" style={{ visibility: "hidden" }}>
                Thêm nhân viên
              </label>
              <button className="btn-primary" onClick={addStaff}>
                Thêm nhân viên
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <section className="staff-list">
          <div className="table-container">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Giới tính</th>
                  <th>Địa chỉ</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {staffList.map((s: any, i) => (
                  <tr key={s.userID}>
                    <td>{i + 1}</td>
                    <td>{s.fullName}</td>
                    <td>{s.gender}</td>
                    <td>{s.address}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>{formatDate(s.createdAt)}</td>
                    <td>{s.status === 1 ? "Hoạt động" : "Ngừng"}</td>

                    <td>
                      <button onClick={() => openEdit(s.userID)}>
                        <i className="fas fa-edit"></i>
                      </button>

                      <button onClick={() => changeStatus(s.userID, s.status)}>
                        <i
                          className={`fas ${s.status === 1 ? "fa-toggle-on" : "fa-toggle-off"}`}
                        ></i>
                      </button>

                      <button onClick={() => deleteStaff(s.userID)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MODAL */}

        {showModal && (
          <div id="staffModal" className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </span>

              <h2>
                <i className="fas fa-user-plus"></i> Sửa nhân viên
              </h2>

              <form className="staff-form">
                <div className="form-group">
                  <label htmlFor="editName">Tên nhân viên</label>
                  <input
                    type="text"
                    id="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editGen">Giới tính</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    id="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Tài khoản</label>
                  <input
                    type="text"
                    id="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    id="passwordHash"
                    value={form.passwordHash}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={saveStaff}
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
