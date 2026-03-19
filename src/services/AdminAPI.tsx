const BASE_URL = "https://localhost:7129";

// ================= PRODUCT =================
export const ProductAPI = {
  loadCategory: () => fetch(`${BASE_URL}/admin/manageProduct/load-category`),

  loadProduct: () => fetch(`${BASE_URL}/admin/manageProduct/load-product`),

  addProduct: (data: any) =>
    fetch(`${BASE_URL}/admin/manageProduct/add-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  uploadImage: (formData: FormData) =>
    fetch(`${BASE_URL}/admin/manageProduct/upload-image`, {
      method: "POST",
      body: formData,
    }),

  deleteProduct: (id: number) =>
    fetch(`${BASE_URL}/admin/manageProduct/delete-product/${id}`, {
      method: "DELETE",
    }),

  updateStatus: (id: number) =>
    fetch(`${BASE_URL}/admin/manageProduct/update-status/${id}`, {
      method: "PUT",
    }),

  updateProduct: (id: number, data: any) =>
    fetch(`${BASE_URL}/admin/manageProduct/update-product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};

// ================= BILL =================
export const BillAPI = {
  getAll: () => fetch(`${BASE_URL}/admin/manageBill/get-all-bill`),

  getById: (id: number) =>
    fetch(`${BASE_URL}/admin/manageBill/get-bill-by-id/${id}`),

  delete: (id: number) =>
    fetch(`${BASE_URL}/admin/manageBill/delete-bill/${id}`, {
      method: "DELETE",
    }),
};

// ================= CUSTOMER =================
export const CustomerAPI = {
  getAll: () => fetch(`${BASE_URL}/admin/manageCustomer/get-all-customer`),

  getDetail: (id: number) =>
    fetch(`${BASE_URL}/admin/manageCustomer/get-customer-detail/${id}`),

  updateStatus: (id: number, status: number) =>
    fetch(`${BASE_URL}/admin/manageCustomer/update-status/${id}/${status}`, {
      method: "PUT",
    }),
};

// ================= REPORT =================
export const ReportAPI = {
  // ===== SUMMARY =====
  getSummaryAll: () => fetch(`${BASE_URL}/admin/manageReport/get-all-summary`),

  getSummaryByDate: (from: string, to: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-summary-by-date?from=${from}&to=${to}`,
    ),

  getSummaryByType: (type: string) =>
    fetch(`${BASE_URL}/admin/manageReport/get-summary-by-type?type=${type}`),

  // ===== PRODUCT =====
  getTopProductAll: () =>
    fetch(`${BASE_URL}/admin/manageReport/get-top-product-all`),

  getTopProductByDate: (from: string, to: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-top-product-by-date?from=${from}&to=${to}`,
    ),

  getTopProductByType: (type: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-top-products-by-type?type=${type}`,
    ),

  // ===== CATEGORY =====
  getCategoryAll: () =>
    fetch(`${BASE_URL}/admin/manageReport/get-top-category-all`),

  getCategoryByDate: (from: string, to: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-top-category-by-date?from=${from}&to=${to}`,
    ),

  getCategoryByType: (type: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-top-category-by-type?type=${type}`,
    ),

  // ===== CUSTOMER =====
  getCustomerAll: () =>
    fetch(`${BASE_URL}/admin/manageReport/get-top-customer-all`),

  getCustomerByDate: (from: string, to: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-top-customer-by-date?from=${from}&to=${to}`,
    ),

  getCustomerByType: (type: string) =>
    fetch(
      `${BASE_URL}/admin/manageReport/get-top-customer-by-type?type=${type}`,
    ),
};

// ================= MANAGE STAFF =================
export const StaffAPI = {
  load: () => fetch(`${BASE_URL}/admin/manageStaff/load-staff`),

  add: (data: any) =>
    fetch(`${BASE_URL}/admin/manageStaff/add-staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  detail: (id: number) => fetch(`${BASE_URL}/admin/manageStaff/detail/${id}`),

  update: (id: number, data: any) =>
    fetch(`${BASE_URL}/admin/manageStaff/update-staff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, status: number) =>
    fetch(
      `${BASE_URL}/admin/manageStaff/update-status/${id}?status=${status}`,
      {
        method: "PUT",
      },
    ),

  delete: (id: number) =>
    fetch(`${BASE_URL}/admin/manageStaff/delete-staff/${id}`, {
      method: "DELETE",
    }),
};
