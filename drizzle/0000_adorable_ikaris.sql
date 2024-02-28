CREATE TABLE IF NOT EXISTS "temp_voices" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"join_to_channel_id" text NOT NULL,
	"temp_voice_channels_category_id" text NOT NULL,
	CONSTRAINT "temp_voices_guild_id_unique" UNIQUE("guild_id"),
	CONSTRAINT "temp_voices_join_to_channel_id_unique" UNIQUE("join_to_channel_id"),
	CONSTRAINT "temp_voices_temp_voice_channels_category_id_unique" UNIQUE("temp_voice_channels_category_id")
);
