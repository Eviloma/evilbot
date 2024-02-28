import 'dotenv/config';

import { bool, cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  GUILD_ID: str(),
  DEFAULT_MEMBER_ROLE_ID: str(),
  GLOBAL_CHANNEL_ID: str(),
  MUSIC_CHANNEL_ID: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
  LAVALINK_NAMES: str(),
  LAVALINK_HOSTS: str(),
  LAVALINK_PASSWORDS: str(),
  LAVALINK_SECURED: str(),
  DISABLE_UPDATE_COMMANDS: bool({ default: false }),
  DATABASE_URL: str(),
});

export default env;
