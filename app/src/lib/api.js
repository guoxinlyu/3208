const BASE = import.meta.env.VITE_API_BASE // 如: https://api.example.com
import { getToken } from './auth.js'

// ---- 真实请求封装 ----
async function request(path, { method = 'GET', body, signal } = {}) {
    if (!BASE) throw new Error('VITE_API_BASE 未配置，正在使用内置 mock（请稍后在 .env.local 设置真实后端）')
    const headers = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, signal })
    if (!res.ok) throw new Error(await res.text() || res.statusText)
    return res.json()
}

export async function login({ username, password }) {
    if (!BASE) return mock.login({ username, password }) // mock
    return request('/auth/login', { method: 'POST', body: { username, password } })
}

export async function listPosts({ q = '' } = {}, opts) {
    if (!BASE) return mock.listPosts({ q })
    const qs = q ? `?q=${encodeURIComponent(q)}` : ''
    return request(`/posts${qs}`, opts)
}

export async function getPost(id, opts) {
    if (!BASE) return mock.getPost(id)
    return request(`/posts/${id}`, opts)
}

export async function createPost(data) {
    if (!BASE) return mock.createPost(data)
    return request('/posts', { method: 'POST', body: data })
}

// ---- 内置 mock（无后端时可直接演示）----
const mockDB = {
    posts: [
        { id: 'p1', title: 'First Build: MX-5 NA', author: 'alex', content: 'Coilovers + Headers + ECU tune.' },
        { id: 'p2', title: 'WRX Wheel Fitment', author: 'blake', content: '18x9.5 +38, 245/40.' },
    ],
}
const mock = {
    async login({ username }) {
        return { token: 'mock-token', username }
    },
    async listPosts({ q }) {
        const all = mockDB.posts
        if (!q) return all
        const s = q.toLowerCase()
        return all.filter(p => p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s))
    },
    async getPost(id) {
        return mockDB.posts.find(p => p.id === id) || null
    },
    async createPost({ title, content }) {
        const id = `p${Date.now()}`
        const post = { id, title, content, author: 'you' }
        mockDB.posts.unshift(post)
        return post
    }
}
