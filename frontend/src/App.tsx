import { AppRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router";
import { CartProvider } from "./context/cart";

function App() {
  return (
    <CartProvider>
      <Router>
        <main>
          <AppRoutes />
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;
