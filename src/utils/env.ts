import { bool, cleanEnv, num, str } from "envalid";

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  CLIENT_SECRET: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
  LAVALINK_NAME: str(),
  LAVALINK_HOST: str(),
  LAVALINK_PORT: num(),
  LAVALINK_PASSWORD: str(),
  LAVALINK_SECURED: str(),
  DATABASE_URL: str(),
  DISABLE_UPDATE_COMMANDS: bool({ default: false }),
  BASE_URL: str(),
});

export default env;
