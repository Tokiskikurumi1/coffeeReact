const BASE_URL = "https://localhost:7129";

// ================= DASHBOARD =================
export const DashboardAPI = {
  getDashboard: (type: string, fromDate?: string, toDate?: string) => {
    let url = `${BASE_URL}/staff/dashboard/dashboard?type=${type}`;

    if (type === "RANGE" && fromDate && toDate) {
      url += `&fromDate=${fromDate}&toDate=${toDate}`;
    }

    return fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  },
};

// ================= BILL =================
export const StaffBillAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/staff/manageBill/get-all-bill`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }),

  getDetail: (id: number) =>
    fetch(`${BASE_URL}/staff/manageBill/get-bill-detail/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }),

  updateStatus: (billId: number, status: number) =>
    fetch(
      `${BASE_URL}/staff/manageBill/update-status?billId=${billId}&status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      },
    ),
};

// ================= ACCOUNT =================
export const StaffAccountAPI = {
  getProfile: () =>
    fetch(`${BASE_URL}/staff/account/get-my-profile`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }),

  updateProfile: (data: any) =>
    fetch(`${BASE_URL}/staff/account/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    }),

  changePassword: (data: any) =>
    fetch(`${BASE_URL}/staff/account/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(data),
    }),
};
