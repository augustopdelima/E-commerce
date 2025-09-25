import { Routes, Route } from "react-router";
import Login from "../pages/login";
import Home from "../pages/home";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
