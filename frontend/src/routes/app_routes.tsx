import { Routes, Route } from "react-router";
import { Home } from "../pages/home";
import { Login, Register } from "../pages/auth";
import { ProductDetails } from "../pages/product-details";
import { UserRoute } from "./user";
import { AdminRoute } from "./admin";
import { OrdersPage } from "../pages/user/orders";
import { UserUpdate } from "../pages/user/update";
import { AddressesListPage, RegisterAddress } from "../pages/user/address";
import { CartPage } from "../pages/user/cart";
import { AdminHomePage, RegisterProducts, AdminOrdersPage, UpdateProduct } from "../pages/admin/";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/user">
        <Route
          index
          element={
            <UserRoute>
              <OrdersPage />
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
              <AddressesListPage />
            </UserRoute>
          }
        />
        <Route
          path="address/register"
          element={
            <UserRoute>
              <RegisterAddress />
            </UserRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <UserRoute>
              <CartPage />
            </UserRoute>
          }
        />
      </Route>

      <Route path="/admin">
        <Route
          index
          element={
            <AdminRoute>
              <AdminHomePage />
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
        <Route
          path="orders"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />
        <Route
          path="edit-product/:id"
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};
