import type { Command } from "@/types/Command";
import { getErrorEmbed } from "@/utils/discord-embeds";
import { canvacord } from "canvacord";
import { GuildMember, SlashCommandBuilder, type User } from "discord.js";

const commands: Command = {
  data: new SlashCommandBuilder()
    .setName("distracted")
    .setDescription("Create an distracted avatar and send it!")
    .addUserOption((el) => el.setName("first-user").setRequired(true).setDescription("The first user to distract."))
    .addUserOption((el) => el.setName("second-user").setRequired(true).setDescription("The second user to distract."))
    .addUserOption((el) => el.setName("third-user").setRequired(true).setDescription("The third user to distract.")),
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

    const firstUser = i.options.getUser("first-user") as User;
    const secondUser = i.options.getUser("second-user") as User;
    const thirdUser = i.options.getUser("third-user") as User;

    const image = await canvacord.distracted(
      firstUser.displayAvatarURL({ extension: "png" }),
      secondUser.displayAvatarURL({ extension: "png" }),
      thirdUser.displayAvatarURL({ extension: "png" }),
    );
    await i.editReply({ files: [{ attachment: image, name: "distracted.png" }] });
  },
};

export default commands;
