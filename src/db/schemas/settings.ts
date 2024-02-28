import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const settingKeys = pgEnum('setting_keys', ['music_channel_id']);

export const settingsSchema = pgTable('guild_settings', {
  key: settingKeys('key').notNull().unique().primaryKey(),
  value: text('value').notNull(),
});

export type Settings = typeof settingsSchema.$inferSelect;
export type SettingsInsert = typeof settingsSchema.$inferInsert;
