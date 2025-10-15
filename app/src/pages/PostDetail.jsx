import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPost } from '../lib/api.js'

export default function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        getPost(id, { signal: controller.signal })
            .then(setPost)
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [id])

    if (loading) return <p>Loading...</p>
    if (!post) return <p>Not found</p>

    return (
        <article className="post">
            <h2>{post.title}</h2>
            <p className="muted">By {post.author}</p>
            <p>{post.content}</p>
        </article>
    )
}
