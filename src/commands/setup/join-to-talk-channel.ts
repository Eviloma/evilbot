import { ChannelType, ChatInputCommandInteraction, GuildChannel } from 'discord.js';

import Client from '../../classes/Client';
import SetupSubCommand from '../../classes/commands/SetupSubCommand';
import { ErrorEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';

export default class JoinToTalkChannel extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: 'setup.join-to-talk-channel',
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel') as GuildChannel;
    await interaction.reply({
      content: 'Updating join to talk channel...',
      fetchReply: true,
      ephemeral: true,
    });

    if (!channel) {
      this.UpdateDatabaseKeySetting('join_to_talk_channel_id', null);
      await interaction.editReply({
        content: `Join to talk channel disabled`,
      });
      return;
    }

    if (channel.type !== ChannelType.GuildVoice) {
      interaction.editReply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, 'Channel must be a voice channel')],
      });
      return;
    }
    await this.UpdateDatabaseKeySetting('join_to_talk_channel_id', channel.id);
    await interaction.editReply({
      content: `Join to talk channel set to <#${channel.id}>`,
    });
  }
}
