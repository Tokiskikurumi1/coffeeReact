import { useEffect, useState } from "react";
import "./Dashboard.css";
import "./base.css";
const API_BASE = "https://localhost:7114/api/ManageProduct";

export default function Dashboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [preview, setPreview] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryID: "",
    image: null as File | null,
  });

  const [editProduct, setEditProduct] = useState<any>(null);

  // ================= LOAD DATA =================

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    const res = await fetch(`${API_BASE}/load-category`);
    const data = await res.json();
    setCategories(data);
  };

  const loadProducts = async () => {
    const res = await fetch(`${API_BASE}/load-product`);
    const data = await res.json();
    setProducts(data);
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // ================= ADD PRODUCT =================

  const addProduct = async () => {
    if (!form.name || !form.price || !form.categoryID || !form.image) {
      alert("Nhập đủ thông tin!");
      return;
    }

    try {
      const upload = new FormData();
      upload.append("file", form.image);

      const uploadRes = await fetch(`${API_BASE}/upload-image`, {
        method: "POST",
        body: upload,
      });

      const uploadData = await uploadRes.json();

      const product = {
        coffeeName: form.name,
        price: parseInt(form.price),
        categoryID: parseInt(form.categoryID),
        imageURL: uploadData.imageUrl,
      };

      await fetch(`${API_BASE}/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      alert("Thêm thành công");

      setForm({
        name: "",
        price: "",
        categoryID: "",
        image: null,
      });

      setPreview("");

      loadProducts();
    } catch {
      alert("Lỗi thêm sản phẩm");
    }
  };

  // ================= DELETE =================

  const deleteProduct = async (id: number) => {
    if (!confirm("Xóa sản phẩm?")) return;

    await fetch(`${API_BASE}/delete-product/${id}`, {
      method: "DELETE",
    });

    loadProducts();
  };

  // ================= UI =================

  return (
    <div id="right-content">
      <main className="admin-main">
        {/* FORM */}
        <section className="add-product-card">
          <h2>
            <i className="fas fa-coffee"></i> Thêm món mới
          </h2>

          <div className="product-form">
            <div className="form-group">
              <label>Tên món</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Cappuccino"
              />
            </div>

            <div className="form-group">
              <label>Giá</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>

            <div className="form-group">
              <label>Ảnh</label>

              <input type="file" onChange={handleImage} />

              {preview && (
                <img
                  src={preview}
                  style={{
                    width: 120,
                    marginTop: 10,
                  }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Loại</label>

              <select
                name="categoryID"
                value={form.categoryID}
                onChange={handleChange}
              >
                <option value="">Chọn loại</option>

                {categories.map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn-primary" onClick={addProduct}>
              Thêm món
            </button>
          </div>
        </section>

        {/* TABLE */}

        <section className="product-list-card">
          <h2>
            <i className="fas fa-list-ul"></i> Danh sách menu
          </h2>

          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Tùy chỉnh</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p, index) => {
                  const category = categories.find(
                    (c) => c.categoryID === p.categoryID,
                  );

                  return (
                    <tr key={p.coffeeID}>
                      <td>{index + 1}</td>

                      <td>
                        <img
                          src={`https://localhost:7114${p.imageURL}`}
                          width="60"
                        />
                      </td>

                      <td>{p.coffeeName}</td>

                      <td>{p.price.toLocaleString("vi-VN")} VND</td>

                      <td>{category?.categoryName}</td>

                      <td>
                        {p.status === 1 ? "Đang phục vụ" : "Ngưng phục vụ"}
                      </td>

                      <td>
                        <button onClick={() => setEditProduct(p)}>
                          <i className="fas fa-edit"></i>
                        </button>

                        <button onClick={() => deleteProduct(p.coffeeID)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
