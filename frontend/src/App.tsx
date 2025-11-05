import { AppRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router";
import { Header } from "./layouts/header/header";

function App() {
  return (
    <Router>
     <div className="min-h-screen flex flex-col"> 
        <Header />
        <main className="flex-1 w-full"> 
          <AppRoutes />
        </main>
      </div> 
    </Router>
  );
}

export default App;
