// src/pages/PostDetail.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost } from '../lib/api.js'

export default function PostDetail() {
    const { id } = useParams()
    const nav = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState('')

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        setErr('')
        getPost(id, { signal: controller.signal })
            .then(setPost)
            .catch(e => setErr(e.message || 'Failed to load'))
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [id])

    if (loading) {
        return (
            <div className="card skeleton" style={{ minHeight: 200 }}>
                <div className="s-line" style={{ width: '40%' }} />
                <div className="s-line" style={{ width: '85%' }} />
                <div className="s-line" style={{ width: '70%' }} />
            </div>
        )
    }
    if (err) return <div className="card">加载失败：{err}</div>
    if (!post) return <div className="card">未找到该帖子</div>

    return (
        <article className="card" style={{ display: 'grid', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => nav(-1)} aria-label="Back">← 返回</button>
            <h2 style={{ margin: '4px 0 0' }}>{post.title}</h2>
            <div className="muted" style={{ fontSize: 14 }}>
                By {post.author} · {new Date(post.created_at || Date.now()).toLocaleString()}
            </div>

            {/* 封面图（有就显示） */}
            {post.cover_url && (
                <img
                    src={post.cover_url}
                    alt="cover"
                    style={{
                        width: '100%',
                        maxHeight: 420,
                        objectFit: 'cover',
                        borderRadius: 12,
                        border: '1px solid var(--border)'
                    }}
                    loading="eager"
                    decoding="async"
                />
            )}

            <div style={{ height: 1, background: 'color-mix(in oklab, var(--text) 10%, transparent)' }} />
            <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
        </article>
    )
}

