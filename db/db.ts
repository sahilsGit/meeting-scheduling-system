import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

// instantiate the postgres client
const client = postgres(process.env.DATABASE_URL!);

// Delegate the querying responsibility to drizzle client
const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

export { client, db };
