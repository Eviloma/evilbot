import { ChannelType, ChatInputCommandInteraction, GuildChannel } from 'discord.js';
import { eq } from 'drizzle-orm';

import Client from '../../classes/Client';
import SubCommand from '../../classes/SubCommand';
import db from '../../db';
import { tempVoicesTable } from '../../db/schemas/temp-voices';
import { ErrorEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';

export default class SetupTempVoice extends SubCommand {
  constructor(client: Client) {
    super(client, {
      name: 'setup.temp-voice',
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { options, guildId } = interaction;

    const joinToTalkChannel = options.getChannel('join-to-talk-channel', true) as GuildChannel;
    const tempVoiceChannelsCategory = options.getChannel('temp-voice-channels-category', true) as GuildChannel;

    if (!guildId) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, 'Guild id not found')],
        ephemeral: true,
      });
      return;
    }

    if (!joinToTalkChannel.isVoiceBased()) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, 'Join to talk channel must be a voice channel')],
        ephemeral: true,
      });
      return;
    }

    if (tempVoiceChannelsCategory.type !== ChannelType.GuildCategory) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, 'Temp voice channels category must be a category')],
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: 'Оновлення налаштувань тимчасових голосових каналів...',
      fetchReply: true,
      ephemeral: true,
    });

    const result = await db.select().from(tempVoicesTable).where(eq(tempVoicesTable.guild_id, guildId));

    await (result.length > 0
      ? db
          .update(tempVoicesTable)
          .set({
            join_to_channel_id: joinToTalkChannel.id,
            temp_voice_channels_category_id: tempVoiceChannelsCategory.id,
          })
          .where(eq(tempVoicesTable.guild_id, guildId))
      : db
          .insert(tempVoicesTable)
          .values({
            guild_id: guildId,
            join_to_channel_id: joinToTalkChannel.id,
            temp_voice_channels_category_id: tempVoiceChannelsCategory.id,
          })
          .execute());

    await interaction.editReply({
      content: `Налаштування тимчасових голосових каналів оновлено.\nКатегорія для новий тимчасових каналів - <#${tempVoiceChannelsCategory.id}>\nКанал для створення нових тимчасових каналів - <#${joinToTalkChannel.id}>`,
    });
  }
}
