import { AppRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router";
import { CartProvider } from "./context/cart";
import { Header } from "./layouts/header/header";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main>
          <AppRoutes />
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;
