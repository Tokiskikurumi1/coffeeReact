import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./sidebar.css";
import "./admin-font.css";
export default function MainLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}
