import { pgTable, serial, text, boolean, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const settings = pgTable('settings', {
    id: integer('id').primaryKey().default(1),
    title: varchar('title', { length: 256 }).notNull(),
    logo: text('logo').notNull(),
    copyright: varchar('copyright', { length: 256 }).notNull(),
    searchEnabled: boolean('search_enabled').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
    id: varchar('id', { length: 128 }).primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
});

export const links = pgTable('links', {
    id: varchar('id', { length: 128 }).primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    url: text('url').notNull(),
    description: text('description').notNull(),
    logoUrl: text('logo_url'),
    categoryId: varchar('category_id', { length: 128 }).notNull().references(() => categories.id, { onDelete: 'cascade' }),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
    category: one(categories, {
        fields: [links.categoryId],
        references: [categories.id],
    }),
}));

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
