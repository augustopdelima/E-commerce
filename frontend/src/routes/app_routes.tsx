import {Routes, Route} from  "react-router";
import { Home } from "../pages/home";
import { Login, Register } from "../pages/auth";
import { ProductDetails } from "../pages/product-details";

export const AppRoutes = () =>  {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/register" element={<Register />}/>
            <Route path="/products/:id" element={<ProductDetails />} />

            <Route path="/user">
                <Route index />
                <Route path="update" />
                <Route path="address" />
                <Route path="address/register"  />
                <Route path="/cart" />
            </Route>

            <Route path="/admin">
                <Route index />
                <Route path="register-products" />
                <Route path="orders"  />
                <Route path="edit-product/:id" />
            </Route>
        </Routes>
    );
};
