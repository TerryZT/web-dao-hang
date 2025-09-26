'use server';

import 'server-only';
import { db } from './db';
import * as schema from './schema';
import type { Category, Settings } from './types';
import { eq } from 'drizzle-orm';

// Helper function to handle potential empty results
async function getOrCreateDefaultSettings(): Promise<Settings> {
    let settingsResult = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
    
    if (settingsResult.length === 0) {
        // If no settings exist, create the default one
        const defaultSettings: Settings = {
            id: 1,
            title: '英语全科启蒙网站导航',
            logo: 'https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png',
            copyright: '© 2024 英语全科启蒙. All Rights Reserved.',
            searchEnabled: true,
        };
         try {
            await db.insert(schema.settings).values(defaultSettings);
            return defaultSettings;
        } catch (error) {
            // In a race condition, another request might have created it. Try fetching again.
            settingsResult = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
            if(settingsResult.length > 0) {
                return settingsResult[0];
            }
            console.error("Failed to create or get default settings", error);
            // Return default object as a fallback to prevent site crash
            return defaultSettings;
        }
    }
    return settingsResult[0];
}


export const getSettings = async (): Promise<Settings> => {
    try {
        const settings = await getOrCreateDefaultSettings();
        return settings;
    } catch (error) {
        console.error("Database error fetching settings:", error);
        // Fallback to default settings if DB fails
        return {
            id: 1,
            title: 'Erin导航',
            logo: 'https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png',
            copyright: '© 2024 英语全科启蒙. All Rights Reserved.',
            searchEnabled: true,
        };
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const categoriesResult = await db.query.categories.findMany({
            with: {
                links: true,
            },
        });
        return categoriesResult;
    } catch (error) {
        console.error("Database error fetching categories:", error);
        return []; // Return empty array on DB error
    }
};
