import AppRoutes from './routes/app_routes'
import { BrowserRouter as Router } from 'react-router'
import Header from './layouts/header'

function App() {

  return (
    <Router>
      <Header />
      <main className='container'>
        <AppRoutes />
      </main>
    </Router>
  )
}

export default App
