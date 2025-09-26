import 'server-only';
import { db } from './db';
import { settingsTable, categoriesTable, linksTable, adminConfigTable } from './db/schema';
import type { Category, Settings, LinkItem } from './types';
import seedData from './app-data.json';
import { eq, sql } from 'drizzle-orm';

// --- Data Seeding and Migration ---

// A simple flag to ensure migration runs only once per server instance.
let migrationDone = false;

async function migrateAndSeed() {
  if (migrationDone) {
    return;
  }
  
  console.log("Checking database schema and data...");

  try {
    // Check if settings table exists and has data. A simple way to check if DB is seeded.
    const currentSettings = await db.select().from(settingsTable).limit(1);
    
    if (currentSettings.length === 0) {
      console.log('Database appears to be empty. Seeding from app-data.json...');

      // Drizzle doesn't have a built-in "CREATE TABLE IF NOT EXISTS",
      // but we can wrap this in a check. Since we checked for settings and it was empty,
      // we assume all tables need to be created and seeded.
      // In a more complex app, you'd use Drizzle Kit migrations.

      // Seed settings
      await db.insert(settingsTable).values(seedData.settings);

      // Seed admin password
      await db.insert(adminConfigTable).values({ id: 1, adminPasswordHash: seedData.adminPasswordHash });

      // Seed categories and links
      for (const category of seedData.categories) {
        await db.insert(categoriesTable).values({ id: category.id, name: category.name });
        if (category.links.length > 0) {
          const linksToInsert = category.links.map(link => ({
            ...link,
            categoryId: category.id,
          }));
          await db.insert(linksTable).values(linksToInsert);
        }
      }
      console.log('Database seeding complete.');
    } else {
      console.log("Database already seeded.");
    }
    migrationDone = true;
  } catch (error) {
     console.error("Error during database migration and seeding:", error);
     // This might happen if tables don't exist. Let's try to create them.
     // This is a simplified approach for this project.
     // For production, `drizzle-kit` migrations are the way to go.
     console.log("Attempting to create database tables...");
     await createTables();
     await migrateAndSeed(); // Retry seeding after creating tables
  }
}

async function createTables() {
    // This is a simplified "migration". It's not robust but works for this self-contained project.
    // It's better than failing silently.
    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS settings (
                title TEXT NOT NULL,
                logo TEXT NOT NULL,
                copyright TEXT NOT NULL,
                "searchEnabled" BOOLEAN NOT NULL
            );
        `);
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS admin_config (
                id INTEGER PRIMARY KEY,
                "adminPasswordHash" TEXT NOT NULL
            );
        `);
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL
            );
        `);
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS links (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                url TEXT NOT NULL,
                description TEXT NOT NULL,
                "logoUrl" TEXT,
                "categoryId" TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
            );
        `);
        console.log("Tables created or already exist.");
    } catch(e) {
        console.error("Failed to create tables:", e);
    }
}


// --- Data Access Functions ---

export const getSettings = async (): Promise<Settings> => {
  await migrateAndSeed();
  const result = await db.select().from(settingsTable).limit(1);
  return result[0] || seedData.settings; // Fallback to seed data if something goes wrong
};

export const getCategories = async (): Promise<Category[]> => {
  await migrateAndSeed();
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  const links = await db.select().from(linksTable);

  const linksByCategory = links.reduce((acc, link) => {
    if (!acc[link.categoryId]) {
      acc[link.categoryId] = [];
    }
    acc[link.categoryId].push(link);
    return acc;
  }, {} as Record<string, LinkItem[]>);

  return categories.map(category => ({
    ...category,
    links: (linksByCategory[category.id] || []).sort((a, b) => a.name.localeCompare(b.name)),
  }));
};

export const getAdminPasswordHash = async (): Promise<string> => {
    await migrateAndSeed();
    const result = await db.select().from(adminConfigTable).where(eq(adminConfigTable.id, 1)).limit(1);
    return result[0]?.adminPasswordHash || seedData.adminPasswordHash;
}

// --- Data Mutation Functions ---

export const updateSettings = async (newSettings: Settings): Promise<Settings> => {
    // In this schema, there's only one row in the settings table.
    await db.update(settingsTable).set(newSettings);
    return newSettings;
}

export const updateCategories = async (categories: Category[]): Promise<Category[]> => {
    // This is a comprehensive update. For large datasets, more granular operations are better.
    // It's a "delete all and replace" strategy for simplicity.
    await db.delete(linksTable);
    await db.delete(categoriesTable);

    for (const category of categories) {
        await db.insert(categoriesTable).values({ id: category.id, name: category.name });
        if (category.links.length > 0) {
            const linksToInsert = category.links.map(link => ({
                ...link,
                categoryId: category.id,
            }));
            await db.insert(linksTable).values(linksToInsert);
        }
    }
    return categories;
}

export const updateAdminPassword = async (newPasswordHash: string): Promise<void> => {
    await db.update(adminConfigTable).set({ adminPasswordHash: newPasswordHash }).where(eq(adminConfigTable.id, 1));
}
