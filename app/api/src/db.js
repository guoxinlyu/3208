import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'Laolvzi123!',
  database: process.env.PGDATABASE || 'appdb',
  port: +(process.env.PGPORT || 5432),
});
