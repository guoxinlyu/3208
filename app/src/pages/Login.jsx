// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login as apiLogin } from '../lib/api.js'
import { saveAuth } from '../lib/auth.js'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
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
        <div className="auth card" style={{ maxWidth: 420, margin: '0 auto' }}>
            <h2 style={{ marginTop: 0 }}>Login</h2>
            <p className="muted" style={{ marginTop: -6 }}>
                You will be redirected after login: <code>{from}</code>
            </p>
            <form onSubmit={onSubmit} className="form" style={{ display: 'grid', gap: 12 }}>
                <label>Username
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input"
                    />
                </label>
                <label>Password
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type={show ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setShow((s) => !s)}
                            aria-label="Toggle password"
                        >
                            {show ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </label>
                {err && <p className="error" role="alert">{err}</p>}
                <button className="btn" disabled={loading}>
                    {loading ? '...' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}

