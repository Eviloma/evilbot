import { Client, GatewayIntentBits } from "discord.js";
import env from "./utils/env";
import { registerClientEvents } from "./utils/handlers";

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

await registerClientEvents(client);

client.login(env.BOT_TOKEN);
