import { useState } from "react";
import { ProductAPI } from "../../../services/AdminAPI";

type Props = {
  categories: any[];
  reload: () => void;
};

export default function AddProductForm({ categories, reload }: Props) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryID: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState("");

  // ================= HANDLE =================
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // ================= FORMAT PRICE =================
  function formatPrice(value: string) {
    const num = value.replace(/[^\d]/g, "");
    if (!num) return "";
    return parseInt(num).toLocaleString("vi-VN") + " VND";
  }

  // ================= ADD =================
  const addProduct = async () => {
    if (!form.name || !form.price || !form.categoryID || !form.image) {
      alert("Nhập đủ thông tin!");
      return;
    }

    try {
      const upload = new FormData();
      upload.append("file", form.image);

      const uploadRes = await ProductAPI.uploadImage(upload);
      const uploadData = await uploadRes.json();

      const product = {
        coffeeName: form.name,
        price: parseInt(form.price),
        categoryID: parseInt(form.categoryID),
        imageURL: uploadData.imageUrl,
      };

      await ProductAPI.addProduct(product);

      alert("Thêm thành công");

      // reset
      setForm({ name: "", price: "", categoryID: "", image: null });
      setPreview("");

      reload();
    } catch {
      alert("Lỗi thêm sản phẩm");
    }
  };

  return (
    <section className="add-product-card">
      <h2>
        <i className="fas fa-coffee"></i> Thêm món mới
      </h2>

      <div className="product-form">
        <div className="form-group">
          <label>Tên món</label>
          <input
            name="name"
            placeholder="Cappuccino"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Giá</label>
          <input
            name="price"
            value={formatPrice(form.price)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, "");
              setForm({ ...form, price: raw });
            }}
            placeholder="50.000 VND"
          />
        </div>

        <div className="form-group">
          <label>Ảnh</label>

          <input type="file" id="productImage" hidden onChange={handleImage} />

          <button
            type="button"
            className="btn-upload"
            onClick={() => document.getElementById("productImage")?.click()}
          >
            Chọn ảnh
          </button>

          {preview && (
            <img src={preview} style={{ width: 120, marginTop: 10 }} />
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
  );
}
