import { Pool } from "pg";
import 'dotenv/config';

const pool: Pool = new Pool();

export const createUserTable = async () => {
  const client = await pool.connect();

  const queryUserText =
    `CREATE TABLE IF NOT EXISTS
      users (
        id UUID PRIMARY KEY,
        username VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(30) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE
      )`;

  const queryUserProfileText =
    `CREATE TABLE IF NOT EXISTS
      user_profiles (
        id UUID PRIMARY KEY,
        user_id UUID NULL,
        thumbnail text,
        email VARCHAR(40) NOT NULL UNIQUE,
        constraint user_id_fk foreign key(user_id) references users(id)
      )`;

  const querySocialAccountsText =
    `CREATE TABLE IF NOT EXISTS
      social_accounts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        social_id VARCHAR(30) NOT NULL,
        access_token VARCHAR(40),
        email VARCHAR(40) NOT NULL UNIQUE
      )`;

  try {
    console.log("start...");
    await client.query('BEGIN');
    await client.query(queryUserText);
    await client.query(queryUserProfileText);
    await client.query(querySocialAccountsText);
    await client.query('COMMIT');
    console.log("success create user Table");
  } catch (e) {
    console.error(e);
    console.log("rollback start...");
    try {
      await client.query('ROLLBACK');
      console.log("rollback success");
    } catch (rollbackError) {
      console.log('A rollback error occurred:', rollbackError);
    }
  } finally {
    client.release();
  }
};

export const dropTables = async (name: string) => {

  const client = await pool.connect();

  const queryText = `DROP TABLE IF EXISTS ${name}`;

  try {
    await client.query('BEGIN');
    await client.query(queryText);
    await client.query('COMMIT');
  } catch (e) {
    console.error(e);
    console.log("rollback start...");
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.log('A rollback error occurred:', rollbackError);
    }
  } finally {
    client.release();
  }
};

// pool.on('remove', () => {
//   console.log('client removed');
//   // process.exit(0);
// });


import 'make-runnable';