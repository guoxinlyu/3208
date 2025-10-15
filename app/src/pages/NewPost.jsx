// src/pages/NewPost.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../lib/api.js'

const DRAFT_KEY = 'newpost_draft_v1'

export default function NewPost() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const raw = localStorage.getItem(DRAFT_KEY)
        if (raw) {
            try { const d = JSON.parse(raw); setTitle(d.title || ''); setContent(d.content || '') } catch { }
        }
    }, [])
    useEffect(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }))
    }, [title, content])

    const canSubmit = useMemo(() => title.trim().length >= 3 && content.trim().length >= 10, [title, content])

    async function onSubmit(e) {
        e.preventDefault()
        if (!canSubmit) return
        setErr(''); setLoading(true)
        try {
            const created = await createPost({ title, content })
            localStorage.removeItem(DRAFT_KEY)
            navigate(`/posts/${created.id}`)
        } catch (e) {
            setErr(e.message || 'Create failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ marginTop: 0 }}>New Post</h2>
            <form onSubmit={onSubmit} className="form" style={{ display: 'grid', gap: 12 }}>
                <label>Title
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required className="input" />
                    <div className="muted" style={{ fontSize: 12 }}>{title.length} / 80</div>
                </label>
                <label>Content
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} required className="textarea" />
                    <div className="muted" style={{ fontSize: 12 }}>{content.length} chars</div>
                </label>
                {err && <p className="error" role="alert">{err}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn" disabled={!canSubmit || loading}>{loading ? '...' : 'Publish'}</button>
                    <button className="btn btn-ghost" type="button" onClick={() => { localStorage.removeItem(DRAFT_KEY); setTitle(''); setContent('') }}>Clear</button>
                </div>
            </form>
        </div>
    )
}

