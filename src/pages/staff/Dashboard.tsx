import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./dashboard.css";

const API = "https://localhost:7203/api/DashBoard/dashboard";

export default function StaffDashboard() {
  const [summary, setSummary] = useState<any>({});
  const [statusChart, setStatusChart] = useState<any[]>([]);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);

  const [type, setType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const orderChartRef = useRef<any>(null);
  const revenueChartRef = useRef<any>(null);

  const total = statusChart.reduce((sum, x) => sum + x.total, 0);
  const percentData = statusChart.map((x) =>
    total === 0 ? 0 : ((x.total / total) * 100).toFixed(2),
  );
  // ================= CALL API =================
  const fetchDashboard = () => {
    let url = `${API}?type=${type}`;

    if (type === "RANGE") {
      url += `&fromDate=${fromDate}&toDate=${toDate}`;
    }

    fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary);
        setStatusChart(data.statusChart);
        setRevenueChart(data.revenueChart);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= RENDER CHART =================
  useEffect(() => {
    if (!statusChart.length) return;

    const ctx = document.getElementById("orderChart");

    if (orderChartRef.current) {
      orderChartRef.current.destroy();
    }

    orderChartRef.current = new Chart(ctx as any, {
      type: "doughnut",
      data: {
        labels: statusChart.map((x) => x.statusName),
        datasets: [
          {
            data: percentData,
            backgroundColor: ["#3498db", "#f06292", "#f39c12", "#e74c3c"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [statusChart]);

  useEffect(() => {
    if (!revenueChart.length) return;

    const ctx = document.getElementById("revenueChart");

    if (revenueChartRef.current) {
      revenueChartRef.current.destroy();
    }

    revenueChartRef.current = new Chart(ctx as any, {
      type: "pie",
      data: {
        labels: revenueChart.map((x) => x.categoryName), // 👈 dynamic
        datasets: [
          {
            data: revenueChart.map((x) => x.revenue), // 👈 dynamic
            backgroundColor: ["#3498db", "#f06292", "#f39c12"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [revenueChart]);

  // ================= FILTER =================
  const handleFilter = () => {
    // 👉 chỉ check khi dùng RANGE
    if (type === "RANGE") {
      if (!fromDate || !toDate) {
        alert("Vui lòng chọn đầy đủ ngày");
        return;
      }

      if (new Date(toDate) < new Date(fromDate)) {
        alert("Ngày đến phải lớn hơn hoặc bằng ngày bắt đầu");
        return;
      }
    }

    fetchDashboard();
  };

  const handleReset = () => {
    setType("ALL");
    setFromDate("");
    setToDate("");
    setTimeout(fetchDashboard, 0);
  };

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h2>Coffee Dashboard</h2>
      </div>

      {/* FILTER */}
      <div className="dashboard-filter">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ALL">Tất cả</option>
          <option value="DAY">Hôm nay</option>
          <option value="WEEK">Tuần này</option>
          <option value="MONTH">Tháng này</option>
          <option value="RANGE">Khoảng ngày</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button onClick={handleFilter}>Lọc</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>{summary.totalOrders || 0}</h3>
          <p>Tất cả đơn</p>
        </div>

        <div className="dashboard-card">
          <h3>{summary.pending || 0}</h3>
          <p>Chờ xác nhận</p>
        </div>

        <div className="dashboard-card">
          <h3>{summary.shipping || 0}</h3>
          <p>Đang giao</p>
        </div>

        <div className="dashboard-card">
          <h3>{summary.completed || 0}</h3>
          <p>Hoàn thành</p>
        </div>

        <div className="dashboard-card">
          <h3>{summary.cancelled || 0}</h3>
          <p>Đã hủy</p>
        </div>
      </div>

      {/* CHART */}
      <div className="charts-wrapper">
        <div className="chart-card">
          <h3>Trạng thái đơn</h3>
          <div className="chart-box">
            <canvas id="orderChart"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>Doanh thu</h3>
          <div className="chart-box">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
