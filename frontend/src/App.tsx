import { AppRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router";
import { Header } from "./layouts/header/header";

function App() {
  return (
    <Router>
      <Header />
      <main className="flex flex-col items-center w-ful h-full">
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
