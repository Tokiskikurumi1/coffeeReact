export default function Cart() {
  return (
    <>
      <div id="container">
        <h1 style={{ margin: 0 }}>GIỎ HÀNG</h1>
        <div className="infor-cart">
          <div className="left-infor-cart">
            <table className="table-infor-cart">
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
              <tbody id="cart-items"></tbody>
            </table>
          </div>
          <div className="right-infor-cart">
            <p>Tạm tính</p>
            <hr />
            <div className="total">
              <p>Tổng</p>
              <p id="total-price">0VND</p>
            </div>
            <button>Đặt hàng</button>
          </div>
        </div>
      </div>
    </>
  );
}
