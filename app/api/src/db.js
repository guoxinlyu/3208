import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  user: process.env.PGUSER || 'appuser',
  password: process.env.PGPASSWORD || 'apppass',
  database: process.env.PGDATABASE || 'appdb',
  port: +(process.env.PGPORT || 5432),
});
