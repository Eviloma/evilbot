import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const settingKeys = pgEnum("setting_keys", [
  "music_channel_id", // Music channel ID. Must be id of a text channel
  "global_channel_id", // Global channel ID. Must be id of a text channel
  "join_role_id", // Join role ID. Must be id of a role
  "join_to_talk_channel_id", // Join to talk channel ID. Must be id of a voice channel
  "temp_voice_channels_category_id", // Temp voice channels category ID. Must be id of a category
]);

export const settingsSchema = pgTable("guild_settings", {
  key: settingKeys("key").notNull().unique().primaryKey(),
  value: text("value").notNull(),
});

export type SettingKeys = (typeof settingKeys.enumValues)[number];

export type Settings = typeof settingsSchema.$inferSelect;
export type SettingsInsert = typeof settingsSchema.$inferInsert;
