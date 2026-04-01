import { ProductAPI } from "../../../services/AdminAPI";

type Props = {
  editProduct: any;
  editForm: any;
  setEditForm: (val: any) => void;
  editPreview: string;
  setEditPreview: (val: string) => void;
  categories: any[];
  onClose: () => void;
  reload: () => void;
};

export default function EditProductModal({
  editProduct,
  editForm,
  setEditForm,
  editPreview,
  setEditPreview,
  categories,
  onClose,
  reload,
}: Props) {
  if (!editProduct) return null;

  // ================= HANDLE IMAGE =================
  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setEditForm((prev: any) => ({ ...prev, image: file }));
    setEditPreview(URL.createObjectURL(file));
  };

  // ================= FORMAT =================
  const formatPrice = (value: string) => {
    const num = value.replace(/[^\d]/g, "");
    if (!num) return "";
    return parseInt(num).toLocaleString("vi-VN") + " VND";
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    try {
      const BASE_IMAGE_URL = "https://localhost:7114";
      let imageURL = editPreview.replace(BASE_IMAGE_URL, "");

      if (editForm.image) {
        const upload = new FormData();
        upload.append("file", editForm.image);

        const uploadRes = await ProductAPI.uploadImage(upload);
        const uploadData = await uploadRes.json();

        imageURL = uploadData.imageUrl;
      }

      const data = {
        coffeeName: editForm.name,
        price: parseInt(editForm.price),
        categoryID: parseInt(editForm.categoryID),
        imageURL: imageURL,
      };

      const res = await ProductAPI.updateProduct(parseInt(editForm.id), data);

      if (!res.ok) throw new Error(await res.text());

      alert("Cập nhật thành công!");

      onClose();
      reload();
    } catch {
      alert("Lỗi khi cập nhật!");
    }
  };

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        <h2>
          <i className="fas fa-edit"></i> Chỉnh sửa món
        </h2>

        <form className="product-form" onSubmit={(e) => e.preventDefault()}>
          <input type="hidden" value={editForm.id} />

          <div className="form-group">
            <label>Tên món</label>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Giá Bán</label>
            <input
              value={formatPrice(editForm.price)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setEditForm({ ...editForm, price: raw });
              }}
            />
          </div>

          <div className="form-group">
            <label>Loại</label>
            <select
              value={editForm.categoryID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  categoryID: e.target.value,
                })
              }
            >
              <option value="">Chọn loại</option>

              {categories.map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ảnh mới (Nếu thay đổi)</label>

            <input
              type="file"
              hidden
              id="editImage"
              onChange={handleEditImage}
            />

            <button
              type="button"
              className="btn-upload"
              onClick={() => document.getElementById("editImage")?.click()}
            >
              Chọn ảnh
            </button>

            <img
              src={editPreview || "https://via.placeholder.com/120"}
              style={{ width: 120, marginTop: 10 }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Hủy
            </button>

            <button type="button" onClick={updateProduct}>
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
