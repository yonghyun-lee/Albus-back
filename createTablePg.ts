import { Pool } from "pg";
import 'dotenv/config';

const pool: Pool = new Pool();

export const createUserTable = async () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users (
        id UUID PRIMARY KEY,
        username VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL
      )`;

  try {
    const res = await pool.query(queryText);
    console.log(res);
    await pool.query('COMMIT');
    console.log(res);
  } catch (e) {
    await pool.query('ROLLBACK');
    console.error(e);
  } finally {
    pool.end();
  }
};

export const dropTables = async (name) => {

  const queryText = `DROP TABLE IF EXISTS ${name}`;

  try {
    const res = await pool.query(queryText);
    console.log(res);
    await pool.query('COMMIT');
  } catch (e) {
    await pool.query('ROLLBACK');
    console.error(e);
  } finally {
    pool.end();
  }
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


import 'make-runnable';