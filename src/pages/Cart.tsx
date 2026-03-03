export default function Cart() {
  return (
    <>
      <div id="container">
        <h1>GIỎ HÀNG</h1>

        <div className="infor-cart">
          <div className="left-infor-cart">
            <table className="table-infor-cart">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div className="right-infor-cart">
            <p>Tạm tính</p>
            <hr />
            <div className="total">
              <p>Tổng</p>
              <p>0 VND</p>
            </div>
            <button>Đặt hàng</button>
          </div>
        </div>
      </div>
    </>
  );
}
