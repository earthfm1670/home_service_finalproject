import { Pool } from "pg";

const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error("connectionString is missing");
}
export const connectionPool = new Pool({
  connectionString: connectionString,
});
