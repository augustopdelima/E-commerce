import { Outlet } from "react-router";
import { AdminSidebar } from "../../components/admin-sidebar/admin-sidebar";

export const AdminLayout = () => {
  return (
    <div className="h-screen max-h-screen w-full flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
