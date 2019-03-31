import { Pool } from "pg";

export const pool = new Pool({
  user: 'scott',
  host: 'localhost',
  database: 'entertainment',
  password: 'tiger',
  port: 5432,
});