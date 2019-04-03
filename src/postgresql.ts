import { Pool } from "pg";

class Postgresql {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
  }

}