import { ButtonStyle, EmbedBuilder, GuildTextBasedChannel } from 'discord.js';
import { Button, Row } from 'easy-discord-components';
import { KazagumoPlayer, KazagumoTrack } from 'kazagumo';
import { capitalize, find, omit } from 'lodash';

import Client from '../classes/Client';
import env from './env';
import audioEffects from './filters';

export default async function MusicControllerUpdate(client: Client, player: KazagumoPlayer, track: KazagumoTrack) {
  player.data.get('message')?.delete();

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
    .setDescription(
      `**Зараз грає**: [${track.title}](${track.uri})\n**Автор**: ${track.author}\n\n **Ввімкнено за запитом**: ${track.requester}\n\n**Статус повтору**: ${player.loop === 'none' ? 'Вимкнено' : player.loop === 'queue' ? 'Список відтворення' : 'Один трек'}\n**Фільтр**: ${capitalize(find(audioEffects, ['value', omit(player.filters, 'volume')])?.key ?? 'Не вдалось визначити')}`
    )
    .setImage(track.thumbnail ?? null)
    .setTimestamp();

  const musicChannel = client.channels.cache.get(env.MUSIC_CHANNEL_ID) as GuildTextBasedChannel | null;

  if (!musicChannel) return;

  await musicChannel
    .send({
      embeds: [embed],
      components: [row],
    })
    .then((x) => player.data.set('message', x));
}
