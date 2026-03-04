import { useEffect, useState } from "react";

const API_BASE = "https://localhost:7027/api";
const BACKEND_URL = "https://localhost:7114";

interface CartItem {
  billDetailID: number;
  coffeeName: string;
  imageURL: string | null;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export default function Cart() {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // ================= LOAD CART =================
  const loadCart = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/Cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        alert("Phiên đăng nhập hết hạn!");
        localStorage.removeItem("accessToken");
        return;
      }

      const data: CartItem[] = await response.json();
      setCartData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= UPDATE TOTAL =================
  useEffect(() => {
    const newTotal = cartData.reduce((sum, item) => sum + item.subTotal, 0);
    setTotal(newTotal);
  }, [cartData]);

  // ================= UPDATE QUANTITY =================
  const changeQuantity = async (billDetailID: number, newQuantity: number) => {
    if (newQuantity <= 0) return;

    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE}/Cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          billDetailID,
          quantity: newQuantity,
        }),
      });

      const message = await res.text();

      if (!res.ok) {
        alert(message);
        return;
      }

      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CHECKOUT =================
  const processCheckout = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/Cart/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const message = await res.text();

      if (!res.ok) {
        alert(message);
        return;
      }

      alert(message);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const formatMoney = (number: number): string => {
    return number.toLocaleString("vi-VN") + " VND";
  };

  // ================= UI =================
  return (
    <div id="container">
      <h1 style={{ margin: 0 }}>GIỎ HÀNG</h1>

      <div className="infor-cart">
        <div className="left-infor-cart">
          <table className="table-infor-cart">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartData.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Giỏ hàng trống
                  </td>
                </tr>
              ) : (
                cartData.map((item) => (
                  <tr key={item.billDetailID}>
                    <td>
                      <img
                        src={
                          item.imageURL
                            ? BACKEND_URL + item.imageURL
                            : "/img/default.png"
                        }
                        width="60"
                        alt=""
                      />
                    </td>
                    <td>{item.coffeeName}</td>
                    <td>{formatMoney(item.unitPrice)}</td>
                    <td>
                      <button
                        className="btnUpdateQuantity"
                        onClick={() =>
                          changeQuantity(item.billDetailID, item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <span style={{ margin: "0 10px" }}>{item.quantity}</span>

                      <button
                        className="btnUpdateQuantity"
                        onClick={() =>
                          changeQuantity(item.billDetailID, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </td>
                    <td>{formatMoney(item.subTotal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="right-infor-cart">
          <p>Tạm tính</p>
          <hr />
          <div className="total">
            <p>Tổng</p>
            <p>{formatMoney(total)}</p>
          </div>

          <button onClick={processCheckout}>Đặt hàng</button>
        </div>
      </div>
    </div>
  );
}
