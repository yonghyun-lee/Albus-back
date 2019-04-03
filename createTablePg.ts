import { Pool } from "pg";
import 'dotenv/config';

const pool: Pool = new Pool();

export const createUserTable = async () => {
  const queryUserText =
    `CREATE TABLE IF NOT EXISTS
      users (
        id UUID PRIMARY KEY,
        username VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE, 
      )`;

  const queryUserProfileText =
    `CREATE TABLE IF NOT EXISTS
      user_profiles (
        id UUID PRIMARY KEY,
        user_id VARCHAR(30) NOT NULL,
        thumbnail text,
        email VARCHAR(40) NOT NULL UNIQUE,
        constraint user_id_fk foreign key(user_id) references users(id), 
      )`;

  const querySocialAccountsText =
    `CREATE TABLE IF NOT EXISTS
      social_accounts (
        id UUID PRIMARY KEY,
        user_id VARCHAR(30) NOT NULL,
        social_id VARCHAR(30) NOT NULL,
        access_token 
        email VARCHAR(40) NOT NULL UNIQUE, 
      )`;

  try {
    await pool.query(queryUserText);
    await pool.query(queryUserProfileText);
    await pool.query(querySocialAccountsText);
    await pool.query('COMMIT');
    console.log("success create user Table");
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