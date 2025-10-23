// src/pages/Posts.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listPosts } from '../lib/api.js'

export default function Posts() {
    const [params, setParams] = useSearchParams()
    const [q, setQ] = useState(params.get('q') || '')
    const [kw, setKw] = useState(q)            // Immediate input value (not debounced)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const tRef = useRef()

    // Input → URL param (immediate), request → q (delayed)
    useEffect(() => {
        clearTimeout(tRef.current)
        tRef.current = setTimeout(() => {
            setQ(kw)
            setParams(kw ? { q: kw } : {})
        }, 300)
        return () => clearTimeout(tRef.current)
    }, [kw, setParams])

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        listPosts({ q }, { signal: controller.signal })
            .then(setItems)
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [q])

    const countText = useMemo(
        () => `${items.length} result${items.length !== 1 ? 's' : ''}`,
        [items]
    )

    return (
        <section style={{ display: 'grid', gap: 16 }}>
            <div className="card" style={{ display: 'grid', gap: 12 }}>
                <form
                    onSubmit={e => e.preventDefault()}
                    style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}
                >
                    <input
                        value={kw}
                        onChange={e => setKw(e.target.value)}
                        placeholder="Search title or excerpt…"
                        className="input"
                        style={{ maxWidth: 360 }}
                        aria-label="Search posts"
                    />
                    <span className="muted" aria-live="polite">{countText}</span>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div className="grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card col-4 skeleton">
                            <div className="s-line" style={{ width: '60%' }} />
                            <div className="s-line" style={{ width: '90%' }} />
                            <div className="s-line" style={{ width: '40%' }} />
                        </div>
                    ))}
                </div>
            ) : items.length ? (
                <ul className="list card" style={{ padding: '12px 16px' }}>
                    {items.map(p => {
                        const cover =
                            p.cover_url || p.cover || p.image || `https://picsum.photos/seed/post${p.id}/400/260`
                        return (
                            <li
                                key={p.id}
                                style={{
                                    padding: '10px 0',
                                    borderBottom:
                                        '1px solid color-mix(in oklab, var(--text) 10%, transparent)',
                                    display: 'grid',
                                    gridTemplateColumns: '120px 1fr',
                                    gap: 12,
                                    alignItems: 'center'
                                }}
                            >
                                <img
                                    src={cover}
                                    alt="cover"
                                    style={{
                                        width: 120,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 10,
                                        border: '1px solid var(--border)'
                                    }}
                                    loading="lazy"
                                />
                                <div>
                                    <Link to={`/posts/${p.id}`}>{p.title}</Link>
                                    <span className="muted"> · {p.author || 'Anonymous'}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div
                    className="card"
                    role="status"
                    aria-live="polite"
                    style={{ textAlign: 'center', padding: '28px' }}
                >
                    <div style={{ fontSize: 18, marginBottom: 6 }}>🤔 No matching posts</div>
                    <div className="muted">
                        Try a different keyword, or <a href="/new">publish the first post</a>?
                    </div>
                </div>
            )}
        </section>
    )
}

