import { AppRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router";

function App() {
  return (
    <Router>
      <main>
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
