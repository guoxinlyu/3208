// src/lib/api.js
// AI assistance: ChatGPT (GPT-5 Thinking) used on 2025-10-22 to review:
// - API base derivation from Vite env with trailing-slash trim,
// - bearer token injection pattern,
// - JSON vs multipart (FormData) requests, and basic error handling strategy.
const BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/+$/, '');

import { getToken } from './auth.js';

export async function request(path, { method = 'GET', body, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}

export async function login({ username, password }) {
  return request('/auth/login', { method: 'POST', body: { username, password } });
}
export async function listPosts({ q = '' } = {}, opts) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : '';
  return request(`/posts${qs}`, opts);
}
export async function getPost(id, opts) {
  return request(`/posts/${id}`, opts);
}
export async function createPost(data) {
  return request('/posts', { method: 'POST', body: data });
}

export async function uploadImage(file, { signal } = {}) {
  const fd = new FormData(); fd.append('file', file);
  const headers = {}; const t = getToken(); if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(`${BASE}/upload`, { method: 'POST', headers, body: fd, signal });
  if (!res.ok) throw new Error((await res.text()) || 'Upload failed'); return res.json();
}

