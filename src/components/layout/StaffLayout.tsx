import Sidebar from "./SidebarStaff";
import { Outlet } from "react-router-dom";
import "./sidebarStaff.css";
// import "./admin-font.css";
export default function StaffLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}
