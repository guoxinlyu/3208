import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../lib/api.js'

export default function NewPost() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const navigate = useNavigate()

    async function onSubmit(e) {
        e.preventDefault()
        setErr('')
        setLoading(true)
        try {
            const created = await createPost({ title, content })
            navigate(`/posts/${created.id}`)
        } catch (e) {
            setErr(e.message || 'Create failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>New Post</h2>
            <form onSubmit={onSubmit} className="form">
                <label>Title
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label>Content
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} required />
                </label>
                {err && <p className="error">{err}</p>}
                <button className="btn" disabled={loading}>{loading ? '...' : 'Publish'}</button>
            </form>
        </div>
    )
}
