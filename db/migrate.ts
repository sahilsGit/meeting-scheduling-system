import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

const initiateMigration = async () => {
  // instantiate the postgres client
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db: PostgresJsDatabase<typeof schema> = drizzle(client);

  try {
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, { migrationsFolder: "./db/migrations" }); // Use absolute path from root here

    // Log statement for successful migration
    console.log("Migration Successful!");
  } catch (error: any) {
    // Log error
    console.log(error.message);
  } finally {
    // close the connection, otherwise the script will hang
    await client.end();
  }
};

// Start the migration process
initiateMigration();
