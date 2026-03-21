import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CustomerProductAPI, CustomerCartAPI } from "../services/CustomerAPI";
const BACKEND_URL = "https://localhost:7114";

interface Category {
  categoryID: number;
  categoryName: string;
}

interface Product {
  coffeeID: number;
  coffeeName: string;
  price: number;
  imageURL: string;
  categoryID: number;
}

export default function Product() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ================= LOAD DATA =================
  useEffect(() => {
    loadCategory();
    loadProducts();
  }, []);

  const loadCategory = async () => {
    const res = await CustomerProductAPI.loadCategory();
    const data = await res.json();
    setCategories(data);
  };

  const loadProducts = async () => {
    const res = await CustomerProductAPI.loadProduct();
    const data = await res.json();
    setProducts(data);
  };

  // ================= FILTER =================
  let filtered = [...products];

  if (currentCategory !== null) {
    filtered = filtered.filter((p) => p.categoryID === currentCategory);
  }

  if (keyword.trim()) {
    filtered = filtered.filter((p) =>
      p.coffeeName.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(start, start + itemsPerPage);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  // ================= ADD TO CART =================
  const addToCart = async (coffeeID: number) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    const res = await CustomerCartAPI.addToCart(coffeeID, 1);

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="container">
      <div className="content slogan products">
        <h1 style={{ color: "red" }}>sản phẩm của chúng tôi</h1>
      </div>

      <div className="content list-food">
        {/* LEFT CATEGORY */}
        <div className="left-list-food">
          <h3>Danh mục</h3>
          <ul>
            <li
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => {
                setCurrentCategory(null);
                setCurrentPage(1);
              }}
            >
              Tất cả
            </li>

            {categories.map((c) => (
              <li
                key={c.categoryID}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentCategory(c.categoryID);
                  setCurrentPage(1);
                }}
              >
                {c.categoryName}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-list-food">
          <div>
            <input
              type="text"
              placeholder="Nhập sản phẩm cần tìm kiếm"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span style={{ cursor: "pointer" }}>Tìm kiếm</span>
          </div>

          <div className="list-food-box">
            {paginatedItems.length === 0 && <p>Không có sản phẩm nào</p>}

            {paginatedItems.map((product) => (
              <Link
                key={product.coffeeID}
                to={`/products/${product.coffeeID}`}
                className="box"
              >
                <img
                  src={
                    product.imageURL
                      ? BACKEND_URL + product.imageURL
                      : "./img/default.png"
                  }
                />
                <h3 style={{ color: "black", textAlign: "center" }}>
                  {product.coffeeName}
                </h3>

                <div className="info">
                  <span>{formatPrice(product.price)} VNĐ</span>

                  <i
                    className="fa-solid fa-cart-plus"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product.coffeeID);
                    }}
                  ></i>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div
            className="pagination"
            style={{ textAlign: "center", marginTop: "auto" }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            <span>
              {totalPages === 0 ? "0 / 0" : `${currentPage} / ${totalPages}`}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
