import type { Command } from "@/types/Command";
import { getErrorEmbed } from "@/utils/discord-embeds";
import { canvacord } from "canvacord";
import { SlashCommandBuilder, type User } from "discord.js";

const commands: Command = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Create an kissed avatar and send it!")
    .addUserOption((el) => el.setName("first-user").setRequired(true).setDescription("The first user to kiss."))
    .addUserOption((el) => el.setName("second-user").setRequired(true).setDescription("The second user to kiss.")),
  async execute(i) {
    const { channel } = i;

    if (!channel?.isTextBased()) {
      await i.reply({
        embeds: [getErrorEmbed(i.client, "This command can only be used in a guild text channel!")],
        ephemeral: true,
      });
      return;
    }

    await i.deferReply();

    const firstUser = i.options.getUser("first-user") as User;
    const secondUser = i.options.getUser("second-user") as User;

    const image = await canvacord.kiss(
      firstUser.displayAvatarURL({ extension: "png" }),
      secondUser.displayAvatarURL({ extension: "png" }),
    );
    if (!image) {
      await i.editReply({ embeds: [getErrorEmbed(i.client, "Failed to generate image!")] });
      return;
    }
    await i.editReply({ files: [{ attachment: image, name: "kiss.png" }] });
  },
};

export default commands;
