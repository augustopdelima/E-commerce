import AppRoutes from "./routes/app_routes";
import { BrowserRouter as Router } from "react-router";
import Header from "./layouts/header";
import { CartProvider } from "./context/cart/cart_context";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="container">
          <AppRoutes />
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;
