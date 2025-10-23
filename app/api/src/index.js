// AI assistance: ChatGPT (GPT-5 Thinking) used on 2025-10-22 to review:
// - /api prefix stripping middleware for GCE Ingress path (/api -> /),
// - JWT auth flow (login/register, bearer parsing, 7d expiry),
// - health check endpoint hitting Postgres (SELECT 1),
// - simple search with ILIKE + LIMIT, and basic error hygiene.
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import uploadRouter from './upload.js'
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    req.url = req.originalUrl.replace(/^\/api(\/|$)/, '/');
  }
  next();
});

app.use(uploadRouter)


const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-please-change';

app.get('/', (_req, res) => res.send('OK'));

app.get('/healthz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});



app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const { rows } = await pool.query('SELECT id, username, password_hash FROM users WHERE username=$1', [username]);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign({ uid: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username });
});


function auth(req, res, next) {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body ?? {}
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Username and password(>=6) required' })
  }
  try {
    const hash = bcrypt.hashSync(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1,$2) RETURNING id, username',
      [username, hash]
    )
    const token = jwt.sign({ uid: rows[0].id, username: rows[0].username }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, username: rows[0].username })
  } catch (e) {
    if (String(e.message).includes('duplicate')) {
      return res.status(409).json({ error: 'Username already exists' })
    }
    res.status(500).json({ error: 'Register failed' })
  }
});


app.get('/posts', async (req, res) => {
  const q = (req.query.q || '').trim();
  let result;
  if (q) {
    result = await pool.query(
      `SELECT id, title, author, created_at, cover_url FROM posts
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY id DESC LIMIT 50`, [`%${q}%`]
    );
  } else {
    result = await pool.query(
      `SELECT id, title, author, created_at, cover_url FROM posts
       ORDER BY id DESC LIMIT 50`
    );
  }
  res.json(result.rows);
});


app.get('/posts/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});


app.post('/posts', auth, async (req, res) => {
  const { title, content, author, cover_url } = req.body ?? {};
  if (!title || !content) return res.status(400).json({ error: 'Missing title or content' });
  const { rows } = await pool.query(
    'INSERT INTO posts (title, content, author, cover_url) VALUES ($1,$2,$3,$4) RETURNING id',
    [title, content, author || req.user.username, cover_url || null]
  );
  res.status(201).json({ id: rows[0].id });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on :${port}`));




