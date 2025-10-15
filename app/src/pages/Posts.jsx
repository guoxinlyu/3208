import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listPosts } from '../lib/api.js'

export default function Posts() {
    const [params, setParams] = useSearchParams()
    const [q, setQ] = useState(params.get('q') || '')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        listPosts({ q }, { signal: controller.signal })
            .then(setItems)
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [q])

    function onSearch(e) {
        e.preventDefault()
        setParams(q ? { q } : {})
    }

    return (
        <div>
            <h2>Posts</h2>
            <form onSubmit={onSearch} className="search">
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
                <button className="btn">Search</button>
            </form>
            {loading ? <p>Loading...</p> : (
                <ul className="list">
                    {items.map(p => (
                        <li key={p.id}>
                            <Link to={`/posts/${p.id}`}>{p.title}</Link>
                            <span className="muted"> · {p.author}</span>
                        </li>
                    ))}
                    {!items.length && <li className="muted">No results</li>}
                </ul>
            )}
        </div>
    )
}
