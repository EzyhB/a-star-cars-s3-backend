import { Pool } from "pg";

const connectionString = process.env.URI;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

const query = (text: string, params?: (string | number | boolean)[]) => {
  return pool.query(text, params);
};

export default query;
