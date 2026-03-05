import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./sidebar.css";
export default function MainLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}
