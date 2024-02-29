DO $$ BEGIN
 CREATE TYPE "setting_keys" AS ENUM('music_channel_id');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild_settings" (
	"key" "setting_keys" PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "guild_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
DROP TABLE "temp_voices";