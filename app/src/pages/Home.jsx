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
            {/* 英雄区 */}
            <section className="hero">
                <h1>改装 · 测评 · 车聚，一站到位</h1>
                <p className="muted">发布你的改装方案与赛道测评，按车型与标签检索，结识同好，一起上路。</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                    <Link to="/posts" className="btn-primary">浏览热门帖子</Link>
                    {!authed && <Link to="/register" className="btn">加入社区</Link>}
                </div>
            </section>

            {/* 最新帖子（真实数据取前三条） */}
            <div className="container" style={{ display: 'grid', gap: 16 }}>
                {loading ? (
                    // 骨架 3 条
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
                        // 兼容不同字段名：cover / cover_url / image
                        const cover =
                            p.cover || p.cover_url || p.image ||
                            `https://picsum.photos/seed/post${p.id || Math.random()}/400/260`

                        return (
                            <article key={p.id} className="post">
                                <img className="thumb" src={cover} alt="cover" />
                                <div>
                                    <h3 className="title">
                                        <Link to={`/posts/${p.id}`}>{p.title || '未命名帖子'}</Link>
                                    </h3>
                                    <div className="muted">
                                        {p.author ? `by ${p.author}` : '匿名作者'}
                                    </div>
                                </div>
                            </article>
                        )
                    })
                ) : (
                    <div className="card" role="status" aria-live="polite" style={{ textAlign: 'center', padding: 28 }}>
                        <div style={{ fontSize: 18, marginBottom: 6 }}>🤔 还没有帖子</div>
                        <div className="muted">
                            去 <Link to="/posts">帖子列表</Link> 看看，或
                            {authed ? <> <Link to="/new">发布第一篇</Link>！</> : <> 先 <Link to="/register">注册</Link> 一下？</>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
