import 'dotenv/config';

import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  GUILD_ID: str(),
  JOIN_TO_TALK_CHANNEL_ID: str(),
  MUSIC_CHANNEL_ID: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
});

export default env;
