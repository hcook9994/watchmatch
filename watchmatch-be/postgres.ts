import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "yourpassword",
  database: "watchmatch",
  port: 5432,
  idleTimeoutMillis: 30000,
});

export default pool;
3;
