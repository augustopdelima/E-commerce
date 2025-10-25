import { AppRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router";
import { CartProvider } from "./context/cart";
import { Header } from "./layouts/header/header";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="flex flex-col items-center justify-center w-full h-full">
          <AppRoutes />
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;
