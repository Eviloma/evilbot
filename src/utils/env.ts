import { bool, cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
  LAVALINK_NAMES: str(),
  LAVALINK_HOSTS: str(),
  LAVALINK_PASSWORDS: str(),
  LAVALINK_SECURED: str(),
  DATABASE_URL: str(),
  DISABLE_UPDATE_COMMANDS: bool({ default: false }),
});

export default env;
