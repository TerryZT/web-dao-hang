import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
}

// for migrations
const migrationClient = postgres(connectionString, { max: 1 });

export const migrateDb = async () => {
    console.log("Running migrations...");
    await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });
    console.log("Migrations completed.");
    await migrationClient.end();
}

// to run migrations manually: bun run src/lib/db/migrate.ts
if (require.main === module) {
    migrateDb().catch(err => {
        console.error("Manual migration failed:", err);
        process.exit(1);
    });
}
