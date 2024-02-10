import 'dotenv/config';

import { cleanEnv, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  GUILD_ID: str(),
  DEFAULT_MEMBER_ROLE_ID: str(),
  GLOBAL_CHANNEL_ID: str(),
  LOG_CHANNEL_ID: str(),
  JOIN_TO_TALK_CHANNEL_ID: str(),
  MUSIC_CHANNEL_ID: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
  LAVALINK_NAMES: str(),
  LAVALINK_HOSTS: str(),
  LAVALINK_PASSWORDS: str(),
  LAVALINK_SECURED: str(),
  LOGGER_HOST: url({ default: 'undefined' }),
  LOGGER_API_KEY: str({ default: 'undefined' }),
});

export default env;
