import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./report.css";
import "./base.css";

const API = "https://localhost:7114/api/ManageReport";

interface Summary {
  revenue: number;
  orders: number;
  avg: number;
}

interface SummaryAPI {
  totalRevenue: number;
  totalBills: number;
  avgPerBill: number;
}

interface Product {
  coffeeName: string;
  totalQuantity: number;
  revenue: number;
}

interface Category {
  categoryName: string;
  revenue: number;
}

interface Customer {
  fullName: string;
  totalBills: number;
  totalSpent: number;
}

export default function Report() {
  const [summary, setSummary] = useState<Summary>({
    revenue: 0,
    orders: 0,
    avg: 0,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [period, setPeriod] = useState<string>("MONTH");

  const productCanvas = useRef<HTMLCanvasElement | null>(null);
  const categoryCanvas = useRef<HTMLCanvasElement | null>(null);

  const productChart = useRef<Chart | null>(null);
  const categoryChart = useRef<Chart | null>(null);

  useEffect(() => {
    generateReport();
  }, []);

  const formatMoney = (num: number) => {
    return num.toLocaleString("vi-VN") + "đ";
  };

  // ================= GENERATE =================

  const generateReport = () => {
    if (period === "ALL") {
      loadSummaryAll();
      loadTopProductAll();
      loadCategoryAll();
      loadCustomerAll();
    } else {
      loadSummaryType(period);
      loadTopProductType(period);
      loadCategoryType(period);
      loadCustomerType(period);
    }
  };

  // ================= FILTER =================

  const filterBills = () => {
    if (!fromDate || !toDate) {
      alert("Vui lòng chọn ngày");
      return;
    }

    loadSummaryDate(fromDate, toDate);
    loadTopProductDate(fromDate, toDate);
    loadCategoryDate(fromDate, toDate);
    loadCustomerDate(fromDate, toDate);
  };

  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setPeriod("ALL");
    generateReport();
  };

  // ================= SUMMARY =================

  const loadSummaryAll = async () => {
    const res = await fetch(`${API}/get-all-summary`);
    const data: SummaryAPI[] = await res.json();
    renderSummary(data);
  };

  const loadSummaryDate = async (from: string, to: string) => {
    const res = await fetch(`${API}/get-summary-by-date?from=${from}&to=${to}`);
    const data: SummaryAPI[] = await res.json();
    renderSummary(data);
  };

  const loadSummaryType = async (type: string) => {
    const res = await fetch(`${API}/get-summary-by-type?type=${type}`);
    const data: SummaryAPI[] = await res.json();
    renderSummary(data);
  };

  const renderSummary = (data: SummaryAPI[]) => {
    if (!data || data.length === 0) return;

    const s = data[0];

    setSummary({
      revenue: s.totalRevenue || 0,
      orders: s.totalBills || 0,
      avg: s.avgPerBill || 0,
    });
  };

  // ================= PRODUCT =================

  const renderProductChart = (data: Product[]) => {
    if (!productCanvas.current) return;

    if (productChart.current) {
      productChart.current.destroy();
    }

    if (!data || data.length === 0) return;

    const labels = data.map((x) => x.coffeeName);
    const values = data.map((x) => x.totalQuantity);

    productChart.current = new Chart(productCanvas.current, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Số lượng bán",
            data: values,
            backgroundColor: "#6b4e31",
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const i = context.dataIndex;
                const quantity = data[i].totalQuantity;
                const revenue = data[i].revenue;

                return [
                  "Số lượng: " + quantity,
                  "Doanh thu: " + revenue.toLocaleString("vi-VN") + "đ",
                ];
              },
            },
          },
        },
      },
    });
  };

  const loadTopProductAll = async () => {
    const res = await fetch(`${API}/get-top-product-all`);
    const data: Product[] = await res.json();
    renderProductChart(data);
  };

  const loadTopProductDate = async (from: string, to: string) => {
    const res = await fetch(
      `${API}/get-top-product-by-date?from=${from}&to=${to}`,
    );
    const data: Product[] = await res.json();
    renderProductChart(data);
  };

  const loadTopProductType = async (type: string) => {
    const res = await fetch(`${API}/get-top-products-by-type?type=${type}`);
    const data: Product[] = await res.json();
    renderProductChart(data);
  };

  // ================= CATEGORY =================

  const renderCategoryChart = (data: Category[]) => {
    if (!categoryCanvas.current) return;

    if (categoryChart.current) {
      categoryChart.current.destroy();
    }

    if (!data || data.length === 0) return;

    const labels = data.map((x) => x.categoryName);
    const values = data.map((x) => x.revenue);

    categoryChart.current = new Chart(categoryCanvas.current, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
          },
        ],
      },
    });
  };

  const loadCategoryAll = async () => {
    const res = await fetch(`${API}/get-top-category-all`);
    const data: Category[] = await res.json();
    renderCategoryChart(data);
  };

  const loadCategoryDate = async (from: string, to: string) => {
    const res = await fetch(
      `${API}/get-top-category-by-date?from=${from}&to=${to}`,
    );
    const data: Category[] = await res.json();
    renderCategoryChart(data);
  };

  const loadCategoryType = async (type: string) => {
    const res = await fetch(`${API}/get-top-category-by-type?type=${type}`);
    const data: Category[] = await res.json();
    renderCategoryChart(data);
  };

  // ================= CUSTOMER =================

  const renderCustomer = (data: Customer[]) => {
    setCustomers(data || []);
  };

  const loadCustomerAll = async () => {
    const res = await fetch(`${API}/get-top-customer-all`);
    const data: Customer[] = await res.json();
    renderCustomer(data);
  };

  const loadCustomerDate = async (from: string, to: string) => {
    const res = await fetch(
      `${API}/get-top-customer-by-date?from=${from}&to=${to}`,
    );
    const data: Customer[] = await res.json();
    renderCustomer(data);
  };

  const loadCustomerType = async (type: string) => {
    const res = await fetch(`${API}/get-top-customer-by-type?type=${type}`);
    const data: Customer[] = await res.json();
    renderCustomer(data);
  };
  // ================= UI =================

  return (
    <div id="right-content">
      <main className="admin-main">
        <section className="report-card">
          <h2>
            <i className="fas fa-chart-line"></i> Báo cáo doanh thu
          </h2>

          <div className="filter-bar">
            <div className="filter-group">
              <label>Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="filter-actions">
              <button className="btn-primary" onClick={filterBills}>
                <i className="fas fa-filter"></i> Lọc
              </button>

              <button className="btn-secondary" onClick={resetFilter}>
                <i className="fas fa-rotate-left"></i> Reset
              </button>
            </div>

            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="ALL">Tất cả</option>
              <option value="DAY">Hôm nay</option>
              <option value="WEEK">Tuần này</option>
              <option value="MONTH">Tháng này</option>
            </select>

            <button className="btn-primary" onClick={generateReport}>
              <i className="fas fa-sync"></i> Xem báo cáo
            </button>
          </div>

          {/* SUMMARY */}

          <div className="stats-grid">
            <div className="stat-card">
              <h4 style={{ color: "#8d6e63", marginBottom: "8px" }}>
                Doanh thu
              </h4>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#6b4e31",
                }}
              >
                {formatMoney(summary.revenue)}
              </p>
            </div>

            <div className="stat-card">
              <h4 style={{ color: "#8d6e63", marginBottom: "8px" }}>
                Số hóa đơn
              </h4>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#6b4e31",
                }}
              >
                {summary.orders}
              </p>
            </div>

            <div className="stat-card">
              <h4 style={{ color: "#8d6e63", marginBottom: "8px" }}>
                Trung bình / đơn
              </h4>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#6b4e31",
                }}
              >
                {formatMoney(summary.avg)}
              </p>
            </div>
          </div>

          {/* PRODUCT CHART */}

          <div className="chart-container-product">
            <h3 style={{ marginBottom: "16px", color: "#6b4e31" }}>
              Top 10 sản phẩm bán chạy
            </h3>
            <canvas ref={productCanvas}></canvas>
          </div>

          {/* CATEGORY */}

          <div className="chart-container-category">
            <h3 style={{ marginBottom: "16px", color: "#6b4e31" }}>
              Doanh thu theo danh mục
            </h3>
            <canvas
              ref={categoryCanvas}
              style={{ maxHeight: "600px" }}
            ></canvas>
          </div>

          {/* CUSTOMER */}

          <div className="space">
            <h3 style={{ marginBottom: "16px", color: "#6b4e31" }}>
              Top khách hàng
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#6b4e31" }}>
                  <th style={{ padding: "12px" }}>Tên khách hàng</th>
                  <th style={{ padding: "12px" }}>Tổng hóa đơn</th>
                  <th style={{ padding: "12px" }}>Tổng chi</th>
                </tr>
              </thead>

              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Chưa có doanh thu
                    </td>
                  </tr>
                ) : (
                  customers.map((c, i) => (
                    <tr key={i}>
                      <td style={{ padding: "10px" }}>{c.fullName}</td>
                      <td style={{ padding: "10px" }}>{c.totalBills}</td>
                      <td style={{ padding: "10px" }}>
                        {c.totalSpent.toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
