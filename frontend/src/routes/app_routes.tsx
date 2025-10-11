import {Routes, Route} from  "react-router";

export const AppRoutes = () =>  {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/login" />
            <Route path="/register" />
            <Route path="/products/:id"  />

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
