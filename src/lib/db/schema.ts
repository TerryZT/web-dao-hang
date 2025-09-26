import { pgTable, text, boolean, integer } from 'drizzle-orm/pg-core';

export const settingsTable = pgTable('settings', {
  title: text('title').notNull(),
  logo: text('logo').notNull(),
  copyright: text('copyright').notNull(),
  searchEnabled: boolean('searchEnabled').notNull(),
});

export const adminConfigTable = pgTable('admin_config', {
    id: integer('id').primaryKey(),
    adminPasswordHash: text('adminPasswordHash').notNull(),
});

export const categoriesTable = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const linksTable = pgTable('links', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description').notNull(),
  logoUrl: text('logoUrl'),
  categoryId: text('categoryId').notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }),
});
