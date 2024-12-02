import { Pool } from "pg";

const connectionString = process.env.CONNECTION_STRING;
console.log(connectionString);
if (!connectionString) {
  console.log(connectionString);
  throw new Error("connectionString is missing");
}
export const connectionPool = new Pool({
  connectionString: connectionString,
});
