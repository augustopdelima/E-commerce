import { Routes, Route } from "react-router";
import Login from "../pages/login";
import Home from "../pages/home";
import ProductDetails from "../pages/product-details";
import { RegisterProducts, AdminRoute } from "../pages/admin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route
        path="/register-products"
        element={
          <AdminRoute>
            <RegisterProducts />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
