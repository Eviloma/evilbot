import { pgTable, text } from 'drizzle-orm/pg-core';

export const guildSchema = pgTable('guild', {
  user: text('user').notNull().primaryKey().unique(),
  valorant: text('valorant').unique(),
});

export type Guild = typeof guildSchema.$inferSelect;
export type GuildInsert = typeof guildSchema.$inferInsert;
