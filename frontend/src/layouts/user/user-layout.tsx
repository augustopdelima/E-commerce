import { Outlet } from "react-router";
import { UserSidebar } from "../../components/user-sidebar";

export const UserLayout = () => {
  return (
   <div className="user-layout">
      <UserSidebar />
      <main className="user-main">
        <Outlet />
      </main>
    </div>
  );
}