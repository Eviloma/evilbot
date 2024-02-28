import { pgTable, text } from 'drizzle-orm/pg-core';

export const tempVoicesTable = pgTable('temp_voices', {
  guild_id: text('guild_id').unique().notNull().primaryKey(),
  join_to_channel_id: text('join_to_channel_id').unique().notNull(),
  temp_voice_channels_category_id: text('temp_voice_channels_category_id').unique().notNull(),
});

export type TempVoice = typeof tempVoicesTable.$inferSelect;
export type TempVoiceInsert = typeof tempVoicesTable.$inferInsert;
