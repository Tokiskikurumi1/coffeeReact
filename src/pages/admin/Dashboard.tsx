import { useEffect, useState } from "react";
import "./Dashboard.css";
import "./base.css";
import AddProductForm from "./DashboardSection/AddProductForm";
import EditProductModal from "./DashboardSection/EditProductModal";

import { ProductAPI } from "../../services/AdminAPI";

export default function Dashboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [editProduct, setEditProduct] = useState<any>(null);
  const [editPreview, setEditPreview] = useState("");
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    price: "",
    categoryID: "",
    image: null as File | null,
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await ProductAPI.loadCategory();
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      alert("Lỗi khi tải danh mục!");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await ProductAPI.loadProduct();
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Lỗi khi tải sản phẩm!");
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id: number) => {
    if (!confirm("Xóa sản phẩm?")) return;
    try {
      await ProductAPI.deleteProduct(id);
      loadProducts();
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm!");
    }
  };

  // ================= LOCK / UNLOCK =================
  const lockProduct = async (id: number) => {
    try {
      const res = await ProductAPI.updateStatus(id);
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  // ================= SEARCH =================

  const filteredProducts = products.filter((p) =>
    p.coffeeName.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= PAGINATION =================

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const currentProducts = filteredProducts.slice(start, end);

  // ================= UI =================

  return (
    <div id="right-content">
      <main className="admin-main">
        {/* FORM */}
        <AddProductForm categories={categories} reload={loadProducts} />

        {/* PRODUCT LIST */}

        <section className="product-list-card">
          <h2>
            <i className="fas fa-list-ul"></i> Danh sách menu
          </h2>
          <div className="filter-bar" style={{ alignItems: "flex-start" }}>
            {/* SEARCH */}
            <div className="filter-group">
              <label>Tìm kiếm</label>
              <input
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="filter-group">
              <label>Loại sản phẩm</label>
              <select>
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Đã khóa</option>
              </select>
            </div>
          </div>

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
                {currentProducts.map((p, index) => {
                  const category = categories.find(
                    (c) => c.categoryID === p.categoryID,
                  );

                  return (
                    <tr key={p.coffeeID}>
                      <td>{start + index + 1}</td>

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
                        <span
                          style={{
                            color: p.status === 1 ? "green" : "red",
                            fontWeight: "600",
                          }}
                        >
                          {p.status === 1 ? "Đang phục vụ" : "Ngưng phục vụ"}
                        </span>
                      </td>

                      <td>
                        <button
                          onClick={() => {
                            setEditProduct(p);

                            setEditForm({
                              id: p.coffeeID,
                              name: p.coffeeName,
                              price: p.price.toString(),
                              categoryID: p.categoryID.toString(),
                              image: null,
                            });

                            setEditPreview(
                              `https://localhost:7114${p.imageURL}`,
                            );
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          style={{ margin: "5px" }}
                          onClick={() => deleteProduct(p.coffeeID)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>

                        <button onClick={() => lockProduct(p.coffeeID)}>
                          {p.status === 1 ? (
                            <i
                              className="fas fa-lock-open"
                              style={{ color: "green" }}
                            ></i>
                          ) : (
                            <i
                              className="fas fa-lock"
                              style={{ color: "red" }}
                            ></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{ marginRight: 10, padding: "5px 10px" }}
            >
              {"<"}
            </button>

            <span style={{ fontWeight: "bold", margin: "0 10px" }}>
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={{ marginLeft: 10, padding: "5px 10px" }}
            >
              {">"}
            </button>
          </div>
        </section>
      </main>
      <EditProductModal
        editProduct={editProduct}
        editForm={editForm}
        setEditForm={setEditForm}
        editPreview={editPreview}
        setEditPreview={setEditPreview}
        categories={categories}
        onClose={() => {
          setEditProduct(null);
          setEditPreview("");
        }}
        reload={loadProducts}
      />
    </div>
  );
}
