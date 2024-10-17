import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  CLIENT_ID: str(),
  JOIN_ROLE_ID: str({ default: undefined }),
  MAIN_TEXT_CHANNEL_ID: str(),
  JOIN_TO_TALK_CHANNEL_ID: str({ default: undefined }),
  JOIN_TO_TALK_GROUP_ID: str({ default: undefined }),
});

export default env;
