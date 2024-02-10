import { ButtonStyle, EmbedBuilder, Message } from 'discord.js';
import { Button, Row } from 'easy-discord-components';
import { KazagumoPlayer, KazagumoTrack } from 'kazagumo';
import { capitalize, find, noop, omit } from 'lodash';

import Client from '../classes/Client';
import EmbedTitles from './embed-titles';
import env from './env';
import audioEffects from './filters';

export default async function MusicControllerUpdate(client: Client, player: KazagumoPlayer, track: KazagumoTrack) {
  const oldMessage = player.data.get('message') as Message | null;

  oldMessage?.delete().catch(noop);

  const row = Row([
    Button({
      customId: 'music-resume',
      label: '▶️',
      style: ButtonStyle.Success,
    }),
    Button({
      customId: 'music-pause',
      label: '⏸️',
      style: ButtonStyle.Secondary,
    }),
    Button({
      customId: 'music-skip',
      label: '⏩',
      style: ButtonStyle.Primary,
    }),
    Button({
      customId: 'music-loop',
      label: '🔁',
      style: ButtonStyle.Primary,
    }),
    Button({
      customId: 'music-stop',
      label: '⏹️',
      style: ButtonStyle.Danger,
    }),
  ]);

  const embed = new EmbedBuilder()
    .setColor(0x56_20_c0)
    .setTitle(EmbedTitles.music)
    .setDescription(
      `**Зараз грає**: [${track.title}](${track.uri})\n**Автор**: ${track.author}\n\n **Ввімкнено за запитом**: ${track.requester}\n\n**Статус повтору**: ${player.loop === 'none' ? 'Вимкнено' : player.loop === 'queue' ? 'Список відтворення' : 'Один трек'}\n**Фільтр**: ${capitalize(find(audioEffects, ['value', omit(player.filters, 'volume')])?.key ?? 'Не вдалось визначити')}`
    )
    .setImage(track.thumbnail ?? null)
    .setTimestamp();

  const musicChannel = client.channels.cache.get(env.MUSIC_CHANNEL_ID);

  if (!musicChannel || !musicChannel.isTextBased()) return;

  await musicChannel
    .send({
      embeds: [embed],
      components: [row],
    })
    .then((x) => player.data.set('message', x));
}
