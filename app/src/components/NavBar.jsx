import { Link, NavLink, useNavigate } from 'react-router-dom'
import { isAuthed, logout, getUser } from '../lib/auth.js'

export default function NavBar() {
    const navigate = useNavigate()
    const authed = isAuthed()
    const user = getUser()

    return (
        <header className="navbar">
            <Link to="/" className="brand">INFS3208 Web</Link>
            <nav className="links">
                <NavLink to="/posts">Posts</NavLink>
                {authed && <NavLink to="/new">New Post</NavLink>}
            </nav>
            <div className="right">
                {authed ? (
                    <>
                        <span className="user">Hi, {user?.username || 'User'}</span>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="btn"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn">Login</Link>
                )}
            </div>
        </header>
    )
}
