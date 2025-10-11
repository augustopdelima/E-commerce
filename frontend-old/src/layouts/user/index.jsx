import { Outlet } from "react-router";
import UserSidebar from "../../components/user-sidebar";
import "./index.css";

export default function AdminLayout() {
  return (
    <div className="user-layout">
      <UserSidebar />
      <main className="user-main">
        <Outlet />
      </main>
    </div>
  );
}