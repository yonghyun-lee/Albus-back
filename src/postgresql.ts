import {Pool} from "pg";
import 'dotenv/config';

class AccessPostgresql {
  private pool: Pool;

  constructor() {
    try {
      this.pool = new Pool();
    } catch (e) {
      console.error(e);

      this.pool.end();

      throw e;
    }
  }

  public selectQuery = async (sql: string, param: [string]) => {
    const client = await this.pool.connect();

    try {
      const result = await client.query(sql, param);

      return result.rows;
    } catch (e) {
      throw e;
    } finally {
      client.release();
    }
  };

  public txQuery  = async (sql: string, param: [string]) => {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(sql, param);

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e
    } finally {
      client.release();
    }

  };

  public end = () => {
    return this.pool.end();
  }

}

export const pg = new AccessPostgresql();