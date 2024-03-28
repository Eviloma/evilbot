CREATE TABLE IF NOT EXISTS "guild" (
	"user" text PRIMARY KEY NOT NULL,
	"valorant" text,
	CONSTRAINT "guild_user_unique" UNIQUE("user"),
	CONSTRAINT "guild_valorant_unique" UNIQUE("valorant")
);
