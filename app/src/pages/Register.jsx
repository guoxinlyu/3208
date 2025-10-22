import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { request } from '../lib/api.js'
import { saveAuth } from '../lib/auth.js'

export default function Register() {
  const [u, setU] = useState(''); const [p, setP] = useState('')
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)
  const nav = useNavigate(); const loc = useLocation()
  async function onSubmit(e) {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const res = await request('/auth/register', { method: 'POST', body: { username: u, password: p } })
      saveAuth(res.token, { username: u })
      const to = loc.state?.from?.pathname || '/'
      nav(to, { replace: true })
    } catch (e) { setErr(e.message || 'Register failed') } finally { setLoading(false) }
  }
  return (
    <form className="card" onSubmit={onSubmit} style={{ maxWidth: 360, margin: '24px auto', display: 'grid', gap: 12 }}>
      <h3>Register</h3>
      <input className="input" placeholder="Username" value={u} onChange={e => setU(e.target.value)} />
      <input className="input" placeholder="Password (>=6)" type="password" value={p} onChange={e => setP(e.target.value)} />
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={loading}>{loading ? '...' : 'Create account'}</button>
      <div className="muted">Already have an account? <Link to="/login">Login</Link></div>
    </form>
  )
}
