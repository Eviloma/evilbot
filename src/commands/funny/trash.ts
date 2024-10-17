import type { Command } from "@/types/Command";
import { getErrorEmbed } from "@/utils/discord-embeds";
import { canvacord } from "canvacord";
import { GuildMember, SlashCommandBuilder } from "discord.js";

const commands: Command = {
  data: new SlashCommandBuilder()
    .setName("trash")
    .setDescription("Create an trash avatar and send it!")
    .addUserOption((el) => el.setName("user").setDescription("The user to trash.")),
  async execute(i) {
    const { channel, member } = i;

    if (!(channel?.isTextBased() && member instanceof GuildMember)) {
      await i.reply({
        embeds: [getErrorEmbed(i.client, "This command can only be used in a guild text channel!")],
        ephemeral: true,
      });
      return;
    }

    await i.deferReply();

    const avatarUrl = (i.options.getUser("user") ?? member)?.displayAvatarURL({ extension: "png" });
    const image = await canvacord.trash(avatarUrl);
    if (!image) {
      await i.editReply({ embeds: [getErrorEmbed(i.client, "Failed to generate image!")] });
      return;
    }
    await i.editReply({ files: [{ attachment: image, name: "trash.png" }] });
  },
};

export default commands;
