export default function Product() {
  return (
    <div className="container">
      <div className="content slogan products">
        <h1 style={{ color: "red" }}>sản phẩm của chúng tôi</h1>
      </div>

      <div className="content list-food">
        <div className="left-list-food">
          <h3>Danh mục</h3>
          <ul id="categoryList"></ul>
        </div>

        <div className="right-list-food">
          <div>
            <input type="text" placeholder="Nhập sản phẩm cần tìm kiếm" />
            <span>Tìm kiếm</span>
          </div>

          <div className="list-food-box"></div>

          <div id="pagination" className="pagination">
            <button>Prev</button>
            <span>1 / 1</span>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
