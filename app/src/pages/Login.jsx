import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login as apiLogin } from '../lib/api.js'
import { saveAuth } from '../lib/auth.js'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    async function onSubmit(e) {
        e.preventDefault()
        setErr('')
        setLoading(true)
        try {
            // 这里会去调用后端 /auth/login。当前无后端时你可以用 mockLogin。
            const res = await apiLogin({ username, password })
            saveAuth(res.token, { username: res.username || username })
            navigate(from, { replace: true })
        } catch (e) {
            setErr(e.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth">
            <h2>Login</h2>
            <form onSubmit={onSubmit} className="form">
                <label>Username
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                {err && <p className="error">{err}</p>}
                <button className="btn" disabled={loading}>{loading ? '...' : 'Sign in'}</button>
            </form>
        </div>
    )
}
