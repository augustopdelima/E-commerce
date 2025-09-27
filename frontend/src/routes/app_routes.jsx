import { Routes, Route } from "react-router";
import Login from "../pages/login";
import RegisterUser from "../pages/register-user";
import Home from "../pages/home";
import ProductDetails from "../pages/product-details";
import {
  RegisterProducts,
  AdminRoute,
  AdminHome,
  UpdateProduct,
} from "../pages/admin";
import {
  UserRoute,
  UserUpdate,
  UserAddress,
  UserAddressRegister,
} from "../pages/user";
import AdminLayout from "../layouts/admin";
import UserLayout from "../layouts/user";
import CartPage from "../pages/cart";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/user" element={<UserLayout />}>
        <Route
          index
          element={
            <UserRoute>
              <>Nada aqui</>
            </UserRoute>
          }
        />
        <Route
          path="update"
          element={
            <UserRoute>
              <UserUpdate />
            </UserRoute>
          }
        />
        <Route
          path="address"
          element={
            <UserRoute>
              <UserAddress />
            </UserRoute>
          }
        />
        <Route
          path="address/register"
          element={
            <UserRoute>
              <UserAddressRegister />
            </UserRoute>
          }
        />
      </Route>

      <Route path="/cart" element={<CartPage />} />
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
        <Route path="edit-product/:id" element={<UpdateProduct />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
