'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { settings as settingsTable, categories as categoriesTable, links as linksTable } from './schema';
import type { Settings, Category, LinkItem } from './types';
import { eq, sql } from 'drizzle-orm';

export async function saveSettings(newSettings: Omit<Settings, 'id'>) {
    try {
        await db.update(settingsTable)
            .set({
                ...newSettings,
                updatedAt: new Date(),
            });
        
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        const error = e as Error;
        console.error('Failed to save settings:', error);
        return { error: `数据库操作失败: ${error.message}` };
    }
}


export async function saveAllCategories(categories: Category[]) {
    try {
        await db.transaction(async (tx) => {
            // Delete all links and categories that are no longer in the new state.
            await tx.execute(sql`DELETE FROM ${linksTable} WHERE id NOT IN ${categories.flatMap(c => c.links).map(l => l.id)}`);
            await tx.execute(sql`DELETE FROM ${categoriesTable} WHERE id NOT IN ${categories.map(c => c.id)}`);

            // Upsert categories
            for (const category of categories) {
                 await tx.insert(categoriesTable)
                    .values({ id: category.id, name: category.name })
                    .onConflictDoUpdate({ 
                        target: categoriesTable.id, 
                        set: { name: category.name } 
                    });
                
                // Upsert links for the category
                if (category.links.length > 0) {
                    for (const link of category.links) {
                        await tx.insert(linksTable)
                            .values({
                                id: link.id,
                                name: link.name,
                                url: link.url,
                                description: link.description,
                                logoUrl: link.logoUrl,
                                categoryId: category.id,
                            })
                            .onConflictDoUpdate({
                                target: linksTable.id,
                                set: {
                                    name: link.name,
                                    url: link.url,
                                    description: link.description,
                                    logoUrl: link.logoUrl,
                                    categoryId: category.id,
                                }
                            });
                    }
                }
            }
        });

        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        const error = e as Error;
        console.error('Failed to save all categories:', error);
        return { error: `数据库事务失败: ${error.message}` };
    }
}
