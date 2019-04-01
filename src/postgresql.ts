import { Pool } from "pg";

export const pool: Pool = new Pool({
  user: 'scott',
  host: 'localhost',
  database: 'entertainment',
  password: 'tiger',
  port: 5432,
});

export const createUserTables = async () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      user (
        id UUID PRIMARY KEY,
        
      )`;

  try {
    const res = await pool.query(queryText);
    console.log(res)
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
};

export const dropTables = async (name) => {

  const queryText = `DROP TABLE IF EXISTS ${name}`;

  try {
    const res = await pool.query(queryText);
    console.log(res)
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
