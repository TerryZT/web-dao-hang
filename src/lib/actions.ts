'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { settings as settingsTable, categories as categoriesTable, links as linksTable } from './schema';
import type { Settings, Category, LinkItem } from './types';
import { eq, sql } from 'drizzle-orm';

export async function saveSettings(newSettings: Omit<Settings, 'id'>) {
    try {
        // There is only one row for settings, so we update it.
        // The ID is always 1, but we use a filter to be safe.
        await db.update(settingsTable)
            .set({
                ...newSettings,
                updatedAt: new Date(),
            })
            .where(eq(settingsTable.id, 1));
        
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
        // This is a complex transaction. We need to:
        // 1. Delete all existing links.
        // 2. Delete all existing categories.
        // 3. Insert the new categories.
        // 4. Insert the new links.
        await db.transaction(async (tx) => {
            await tx.delete(linksTable);
            await tx.delete(categoriesTable);

            if (categories.length > 0) {
                 const newCategories = categories.map(c => ({
                    id: c.id,
                    name: c.name
                }));
                await tx.insert(categoriesTable).values(newCategories);

                const allLinks: Omit<LinkItem, 'categoryId'>[] = [];
                categories.forEach(c => {
                    c.links.forEach(l => {
                        allLinks.push({
                            id: l.id,
                            name: l.name,
                            url: l.url,
                            description: l.description,
                            logoUrl: l.logoUrl,
                            categoryId: c.id, // Add categoryId for the relation
                        });
                    });
                });
                
                if (allLinks.length > 0) {
                    await tx.insert(linksTable).values(allLinks.map(link => ({
                        ...link,
                        id: link.id,
                        categoryId: link.categoryId
                    })));
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
