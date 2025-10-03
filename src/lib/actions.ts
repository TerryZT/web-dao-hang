'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { settings as settingsTable, categories as categoriesTable, links as linksTable } from './schema';
import type { Settings, Category, LinkItem } from './types';
import { eq, sql, SQL } from 'drizzle-orm';

export async function saveSettings(newSettings: Omit<Settings, 'id'>) {
    try {
        await db.update(settingsTable)
            .set({
                ...newSettings
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
            const linkIdsToKeep = categories.flatMap(c => c.links.map(l => l.id)).filter(Boolean);
            const categoryIdsToKeep = categories.map(c => c.id).filter(Boolean);

            const deleteLinksQuery = linkIdsToKeep.length > 0 
                ? sql`DELETE FROM ${linksTable} WHERE id NOT IN ${sql.join(linkIdsToKeep.map(id => sql.placeholder(id)), sql`, `)}`
                : sql`DELETE FROM ${linksTable}`;
            
            await tx.execute(
                linkIdsToKeep.length > 0 
                ? sql`DELETE FROM ${linksTable} WHERE id NOT IN ${sql.join(linkIdsToKeep.map(id => sql.placeholder(id)), sql`, `)}`
                : sql`DELETE FROM ${linksTable}`,
                ...linkIdsToKeep
            );

            await tx.execute(
                categoryIdsToKeep.length > 0
                ? sql`DELETE FROM ${categoriesTable} WHERE id NOT IN ${sql.join(categoryIdsToKeep.map(id => sql.placeholder(id)), sql`, `)}`
                : sql`DELETE FROM ${categoriesTable}`,
                ...categoryIdsToKeep
            );


            for (const [index, category] of categories.entries()) {
                 await tx.insert(categoriesTable)
                    .values({ id: category.id, name: category.name })
                    .onConflictDoUpdate({ 
                        target: categoriesTable.id, 
                        set: { name: category.name } 
                    });
                
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
