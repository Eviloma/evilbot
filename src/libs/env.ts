import 'dotenv/config';

import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  GUILD_ID: str(),
});

export default env;