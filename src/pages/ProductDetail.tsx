export default function ProductDetail() {
  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img id="product-image" src="" alt="" />
        </div>
        <div className="product-info">
          <h1 id="product-name"></h1>
          <div className="price" id="product-price"></div>
          <div className="quantity-selector">
            <button id="decrease-quantity">-</button>
            <input type="number" id="quantity" value="1" min="1" />
            <button id="increase-quantity">+</button>
            <button
              className="add-to-cart"
              id="add-to-cart-btn"
              style={{ color: "black" }}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          <p id="product-description"></p>
        </div>
      </div>
    </div>
  );
}
