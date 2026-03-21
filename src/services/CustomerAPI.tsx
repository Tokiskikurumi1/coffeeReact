const BASE_URL = "https://localhost:7129";

// ================= HELPER =================
const getAuthHeader = () => ({
  Authorization: "Bearer " + localStorage.getItem("accessToken"),
});

export const TotalProduct = {
  getTotalProduct: async () => {
    const res = await fetch(`${BASE_URL}/customer/TotalProduct/top-selling`);
    return res.json();
  },
};

// ===================================================================
// ======================= PRODUCT (PUBLIC) ===========================
// ===================================================================
export const CustomerProductAPI = {
  loadCategory: () => fetch(`${BASE_URL}/customer/product/load-category`),

  loadProduct: () => fetch(`${BASE_URL}/customer/product/load-product`),

  loadByCategory: (id: number) =>
    fetch(`${BASE_URL}/customer/product/load-product-by-category/${id}`),

  getDetailProduct: (id: number) =>
    fetch(`${BASE_URL}/customer/product/load-coffee-by-ID/${id}`),
};

// ===================================================================
// =========================== CART ==================================
// ===================================================================
export const CustomerCartAPI = {
  getCart: () =>
    fetch(`${BASE_URL}/customer/cart`, {
      headers: getAuthHeader(),
    }),

  addToCart: (coffeeID: number, quantity: number) =>
    fetch(`${BASE_URL}/customer/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ coffeeID, quantity }),
    }),

  updateCart: (billDetailID: number, quantity: number) =>
    fetch(`${BASE_URL}/customer/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ billDetailID, quantity }),
    }),

  checkout: () =>
    fetch(`${BASE_URL}/customer/cart/checkout`, {
      method: "POST",
      headers: getAuthHeader(),
    }),
};

// ===================================================================
// =========================== PROFILE ================================
// ===================================================================
export const CustomerProfileAPI = {
  getProfile: () =>
    fetch(`${BASE_URL}/customer/profile/get-profile`, {
      headers: getAuthHeader(),
    }),

  updateProfile: (data: any) =>
    fetch(`${BASE_URL}/customer/profile/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    }),

  uploadAvatar: (formData: FormData) =>
    fetch(`${BASE_URL}/customer/profile/customer-upload-image`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    }),

  getOrders: (status: string) =>
    fetch(`${BASE_URL}/customer/profile/get-orders?status=${status}`, {
      headers: getAuthHeader(),
    }),

  cancelOrder: (billId: number) =>
    fetch(`${BASE_URL}/customer/profile/cancel-order/${billId}`, {
      method: "POST",
      headers: getAuthHeader(),
    }),
};
