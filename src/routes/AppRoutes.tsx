import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Introduct from "../pages/Introduct";
import Product from "../pages/Product";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import Login from "../pages/Login";
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../components/layout/AdminLayout";
import Bills from "../pages/admin/Bill";
import Customer from "../pages/admin/Customer";
import Report from "../pages/admin/Report";
import Staff from "../pages/admin/Staff";
import Profile from "../pages/Profile";

import StaffLayout from "../components/layout/StaffLayout";
import StaffDashboard from "../pages/staff/Dashboard";
import RequestBill from "../pages/staff/BillRequest";
import ProfileStaff from "../pages/staff/ProfileStaff";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Main Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="intro" element={<Introduct />} />
        <Route path="products" element={<Product />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bills" element={<Bills />} />
        <Route path="report" element={<Report />} />
        <Route path="customers" element={<Customer />} />
        <Route path="staff" element={<Staff />} />
      </Route>
      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboard />}></Route>
        <Route path="requestBills" element={<RequestBill />}></Route>
        <Route path="profileStaff" element={<ProfileStaff />}></Route>
      </Route>
    </Routes>
  );
}
