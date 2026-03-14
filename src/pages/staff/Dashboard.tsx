import { useEffect } from "react";
import Chart from "chart.js/auto";
import Sidebar from "../../components/layout/SidebarStaff";

import "./dashboard.css";

export default function StaffDashboard() {
  useEffect(() => {
    const orderCtx = document.getElementById("orderChart") as HTMLCanvasElement;

    new Chart(orderCtx, {
      type: "doughnut",
      data: {
        labels: ["Chờ xác nhận", "Đang giao", "Hoàn thành"],
        datasets: [
          {
            data: [5, 8, 6],
            backgroundColor: ["#3498db", "#f06292", "#f39c12"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const revenueCtx = document.getElementById(
      "revenueChart",
    ) as HTMLCanvasElement;

    new Chart(revenueCtx, {
      type: "pie",
      data: {
        labels: ["Cà phê", "Trà", "Bánh"],
        datasets: [
          {
            data: [3200000, 1200000, 800000],
            backgroundColor: ["#3498db", "#f06292", "#f39c12"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, []);

  return (
    <>
      <div className="page-content">
        {/* HEADER */}

        <div className="dashboard-header">
          <div className="header-title">
            <i className="fa-solid fa-mug-saucer coffee-icon"></i>
            <h2>Coffee Dashboard</h2>
          </div>
        </div>

        {/* FILTER */}

        <div className="dashboard-filter">
          <select>
            <option>Tất cả</option>
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>

          <label>Từ</label>
          <input type="date" />

          <label>Đến</label>
          <input type="date" />

          <button>
            <i className="fa-solid fa-filter"></i> Lọc
          </button>
        </div>

        {/* CARDS */}

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <i className="fa-solid fa-receipt icon"></i>
            <h3>10</h3>
            <p>Tất cả đơn</p>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-hourglass-half icon"></i>
            <h3>3</h3>
            <p>Chờ xác nhận</p>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-truck-fast icon"></i>
            <h3>4</h3>
            <p>Đang giao</p>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-check-circle icon"></i>
            <h3>3</h3>
            <p>Hoàn thành</p>
          </div>
        </div>

        {/* CHARTS */}

        <div className="charts-wrapper">
          <div className="chart-card">
            <h3>
              <i className="fa-solid fa-chart-pie"></i> Trạng thái đơn
            </h3>

            <div className="chart-area">
              <canvas id="orderChart"></canvas>
            </div>
          </div>

          <div className="chart-card">
            <h3>
              <i className="fa-solid fa-coins"></i> Doanh thu
            </h3>

            <div className="chart-area">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
