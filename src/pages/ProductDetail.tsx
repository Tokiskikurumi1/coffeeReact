import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CustomerProductAPI, CustomerCartAPI } from "../services/CustomerAPI";
const BACKEND_URL = "https://localhost:7114";

interface ProductDetailType {
  coffeeID: number;
  coffeeName: string;
  price: number;
  imageURL: string;
  description?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [quantity, setQuantity] = useState(1);

  // ================= LOAD DETAIL =================
  useEffect(() => {
    if (!id) {
      alert("Không tìm thấy sản phẩm");
      navigate("/");
      return;
    }

    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      const res = await CustomerProductAPI.getDetailProduct(Number(id));

      if (!res.ok) {
        alert("Sản phẩm không tồn tại hoặc đã ngừng phục vụ");
        navigate("/");
        return;
      }

      const data = await res.json();
      const coffee = data[0];

      setProduct(coffee);
    } catch (err) {
      console.error("Lỗi load detail:", err);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      const res = await CustomerCartAPI.addToCart(Number(id), quantity);

      if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("accessToken");
        return;
      }

      const message = await res.text();

      if (!res.ok) {
        alert("Lỗi: " + message);
        return;
      }

      alert("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      console.error("Lỗi add to cart:", err);
      alert("Không thể kết nối đến server");
    }
  };

  if (!product) return <p style={{ textAlign: "center" }}>Đang tải...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img
            src={
              product.imageURL
                ? BACKEND_URL + product.imageURL
                : "/img/default.png"
            }
            alt={product.coffeeName}
          />
        </div>

        <div className="product-info">
          <h1>{product.coffeeName}</h1>

          <div className="price">{formatPrice(product.price)} VNĐ</div>

          <div className="quantity-selector">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              -
            </button>

            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />

            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>

            <button
              className="add-to-cart"
              style={{ color: "black" }}
              onClick={handleAddToCart}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          <p>
            {product.description || "Thức uống thơm ngon, đậm đà hương vị."}
          </p>
        </div>
      </div>
    </div>
  );
}
