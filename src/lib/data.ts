"use server";

import "server-only";
import { db } from "@/lib/db";
import {
  settingsTable,
  categoriesTable,
  linksTable,
  adminConfigTable,
} from "@/lib/db/schema";
import type { Category, LinkItem, Settings } from "@/lib/types";
import { eq } from "drizzle-orm";
import { migrateDb } from "./db/migrate";

// --- Data Access Functions ---
const runMigration = async () => {
  try {
    await migrateDb();
  } catch (e: any) {
    console.error("Migration failed:", e.message);
    // We can choose to not throw here to allow the app to run with an old schema
    // but for this app, we want to ensure schema is up to date.
    throw new Error("Database migration failed. Check the connection and schema.");
  }
}

export const getSettings = async (): Promise<Settings> => {
  await runMigration();
  const settingsResult = await db.select().from(settingsTable).limit(1);
  if (settingsResult.length === 0) {
     // This case should ideally not be hit if migration and seeding are correct.
    const defaultSettings = { 
        title: "Erin导航", 
        logo: "https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png", 
        copyright: "© 2024 英语全科启蒙. All Rights Reserved.", 
        searchEnabled: true 
    };
    await db.insert(settingsTable).values(defaultSettings);
    return defaultSettings;
  }
  return settingsResult[0];
};

export const getCategories = async (): Promise<Category[]> => {
  await runMigration();
  const categoriesResult = await db.select().from(categoriesTable);
  const linksResult = await db.select().from(linksTable);

  return categoriesResult.map((c) => ({
    ...c,
    links: linksResult.filter((l) => l.categoryId === c.id),
  }));
};

export const getAdminPasswordHash = async (): Promise<string> => {
  await runMigration();
  const result = await db.select().from(adminConfigTable).limit(1);
  if (result.length === 0) {
      const defaultHash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // password
      await db.insert(adminConfigTable).values({ adminPasswordHash: defaultHash });
      return defaultHash;
  }
  return result[0].adminPasswordHash;
};

// --- Data Mutation Functions ---

export const updateSettings = async (newSettings: Omit<Settings, 'id'>): Promise<void> => {
  await db.update(settingsTable).set(newSettings);
};

export const updateAdminPassword = async (newPasswordHash: string): Promise<void> => {
  await db.update(adminConfigTable).set({ adminPasswordHash: newPasswordHash });
};

export const addCategoryDb = async (category: Omit<Category, 'links'>) => {
    await db.insert(categoriesTable).values(category);
}

export const updateCategoryDb = async (id: string, newName: string) => {
    await db.update(categoriesTable).set({ name: newName }).where(eq(categoriesTable.id, id));
}

export const deleteCategoryDb = async (id: string) => {
    // Also delete associated links
    await db.delete(linksTable).where(eq(linksTable.categoryId, id));
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
}

export const addLinkDb = async (link: LinkItem) => {
    await db.insert(linksTable).values(link);
}

export const updateLinkDb = async (id: string, linkData: Omit<LinkItem, "id">) => {
    await db.update(linksTable).set(linkData).where(eq(linksTable.id, id));
}

export const deleteLinkDb = async (id: string) => {
    await db.delete(linksTable).where(eq(linksTable.id, id));
}
