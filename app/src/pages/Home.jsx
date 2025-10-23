// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthed } from '../lib/auth.js'
import { listPosts } from '../lib/api.js'

export default function Home() {
    const authed = isAuthed()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        listPosts({ q: '' }, { signal: controller.signal })
            .then(res => setItems(Array.isArray(res) ? res.slice(0, 3) : []))
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [])

    return (
        <div>
            {/* Hero section */}
            <section className="hero">
                <h1>Mods · Reviews · Meets — all in one place</h1>
                <p className="muted">
                    Share your build and track reviews, search by model and tags, meet fellow enthusiasts, and hit the road together.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                    <Link to="/posts" className="btn-primary">Browse popular posts</Link>
                    {!authed && <Link to="/register" className="btn">Join the community</Link>}
                </div>
            </section>

            {/* Latest posts (show first 3 from real data) */}
            <div className="container" style={{ display: 'grid', gap: 16 }}>
                {loading ? (
                    // 3 skeleton cards
                    Array.from({ length: 3 }).map((_, i) => (
                        <article key={i} className="post skeleton">
                            <div className="thumb" />
                            <div>
                                <div className="s-line" style={{ width: '60%' }} />
                                <div className="s-line" style={{ width: '90%' }} />
                                <div className="s-line" style={{ width: '40%' }} />
                            </div>
                        </article>
                    ))
                ) : items.length ? (
                    items.map(p => {
                        // Support different field names: cover / cover_url / image
                        const cover =
                            p.cover || p.cover_url || p.image ||
                            `https://picsum.photos/seed/post${p.id || Math.random()}/400/260`

                        return (
                            <article key={p.id} className="post">
                                <img className="thumb" src={cover} alt="cover" />
                                <div>
                                    <h3 className="title">
                                        <Link to={`/posts/${p.id}`}>{p.title || 'Untitled post'}</Link>
                                    </h3>
                                    <div className="muted">
                                        {p.author ? `by ${p.author}` : 'Anonymous'}
                                    </div>
                                </div>
                            </article>
                        )
                    })
                ) : (
                    <div className="card" role="status" aria-live="polite" style={{ textAlign: 'center', padding: 28 }}>
                        <div style={{ fontSize: 18, marginBottom: 6 }}>🤔 No posts yet</div>
                        <div className="muted">
                            Check the <Link to="/posts">posts list</Link>, or
                            {authed
                                ? <> <Link to="/new">create the first post</Link>!</>
                                : <> <Link to="/register">sign up</Link> first?</>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
