/* eslint-disable sonarjs/no-nested-template-literals */
import { ChatInputCommandInteraction } from 'discord.js';
import { join } from 'lodash';

import Client from '../../classes/Client';
import SetupSubCommand from '../../classes/commands/SetupSubCommand';

const ENABLED = '✅ Enabled';
const DISABLED = '❌ Disabled';

export default class Show extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: 'setup.show',
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const globalChannel = this.client.GetSetting('global_channel_id');
    const JoinRole = this.client.GetSetting('join_role_id');
    const JoinToTalkChannel = this.client.GetSetting('join_to_talk_channel_id');
    const MusicChannel = this.client.GetSetting('music_channel_id');
    const TempVoiceChannelsCategory = this.client.GetSetting('temp_voice_channels_category_id');

    const data = [];

    data.push(
      '**Global Channel**',
      `Status: ${globalChannel ? ENABLED : DISABLED}`,
      `Channel: ${globalChannel ? `<#${globalChannel}>` : '-'}`,
      '',
      '**Music Channel**',
      `status: ${MusicChannel ? ENABLED : DISABLED}`,
      `channel: ${MusicChannel ? `<#${MusicChannel}>` : '-'}`,
      '',
      '**Join Role**',
      `status: ${JoinRole ? ENABLED : DISABLED}`,
      `role: ${JoinRole ? `<@&${JoinRole}>` : '-'}`,
      '',
      '**Join To Talk Module**',
      `status: ${JoinToTalkChannel && TempVoiceChannelsCategory ? ENABLED : DISABLED}`,
      `channel: ${JoinToTalkChannel ? `<#${JoinToTalkChannel}>` : '-'}`,
      `category: ${TempVoiceChannelsCategory ? `<#${TempVoiceChannelsCategory}>` : '-'}`
    );

    interaction.reply({
      content: join(data, '\n'),
      ephemeral: true,
    });
  }
}
