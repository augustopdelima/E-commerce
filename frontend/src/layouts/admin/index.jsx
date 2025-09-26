import { Outlet } from "react-router";
import AdminSidebar from "../../components/admin-sidebar";
import "./index.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}