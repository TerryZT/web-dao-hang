import { pgTable, text, boolean, integer } from 'drizzle-orm/pg-core';

export const settingsTable = pgTable('settings', {
  title: text('title').notNull(),
  logo: text('logo').notNull(),
  copyright: text('copyright').notNull(),
  searchEnabled: boolean('search_enabled').notNull(),
});

export const adminConfigTable = pgTable('admin_config', {
    id: integer('id').primaryKey(),
    adminPasswordHash: text('admin_password_hash').notNull(),
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
  logoUrl: text('logo_url'),
  categoryId: text('category_id').notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }),
});
