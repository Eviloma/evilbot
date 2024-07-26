import crypto from "node:crypto";

import type Client from "@/classes/Client";
import SetupSubCommand from "@/classes/commands/SetupSubCommand";
import env from "@/utils/env";
import { ButtonBuilder, ButtonStyle, type ChatInputCommandInteraction } from "discord.js";
import { Row } from "easy-discord-components";

export default class ValorantLink extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: "valorant.link",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const url = this.client.oauth.generateAuthUrl({
      scope: ["identify", "connections"],
      redirectUri: `${env.BASE_URL}/valorant/callback`,
      responseType: "code",
      state: crypto.randomBytes(16).toString("hex"),
    });

    const button = new ButtonBuilder().setLabel("Link").setURL(url).setStyle(ButtonStyle.Link);

    interaction.reply({
      content:
        "Link your Riot account to Discord. After that click the button below and let the bot get your connections.",
      ephemeral: true,
      components: [Row([button])],
    });
  }
}
