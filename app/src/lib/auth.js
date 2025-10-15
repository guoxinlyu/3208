const KEY = 'infs3208_auth'

export function saveAuth(token, user) {
    localStorage.setItem(KEY, JSON.stringify({ token, user }))
}

export function getAuth() {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
}

export function getToken() {
    return getAuth()?.token || ''
}

export function getUser() {
    return getAuth()?.user || null
}

export function isAuthed() {
    return !!getToken()
}

export function logout() {
    localStorage.removeItem(KEY)
}
