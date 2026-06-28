import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserDetail from './pages/UserDetail'

// Sets up the shared app layout and routes.
function App() {
  return (
    <>
      <header className="app-header">
        <Link to="/" className="app-title">
          User Manager
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </>
  )
}

export default App
