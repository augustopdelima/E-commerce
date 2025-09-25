import { Routes, Route } from "react-router";
import Login from "../pages/login";
import Home from "../pages/home";
import ProductDetails from "../pages/product-details";
import { RegisterProducts, AdminRoute, AdminHome } from "../pages/admin";
import AdminLayout from "../layouts/admin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
        <Route
          path="register-products"
          element={
            <AdminRoute>
              <RegisterProducts />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
