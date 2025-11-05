import { Outlet } from "react-router";
import { UserSidebar } from "../../components/user-sidebar";

export const UserLayout = () => {
  return (
    <div className="h-screen max-h-screen w-full flex">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div> 
  );
};
