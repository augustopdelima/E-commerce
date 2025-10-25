import { Outlet } from "react-router";
import { AdminSidebar } from "../../components/admin-sidebar/admin-sidebar";

export const AdminLayout = () => {
  return (
    <div>
        <AdminSidebar />
        <main>
            <Outlet />
        </main>
    </div>
  );
}