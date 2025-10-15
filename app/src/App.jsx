import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import './App.css'

export default function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Outlet />
      </div>
    </>
  )
}
