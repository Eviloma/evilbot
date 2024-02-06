import { ButtonStyle, EmbedBuilder, GuildTextBasedChannel } from 'discord.js';
import { Button, Row } from 'easy-discord-components';
import { KazagumoPlayer, KazagumoTrack } from 'kazagumo';

import Client from '../classes/Client';
import env from './env';

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
    .addFields(
      {
        name: 'Зараз грає:',
        value: `[${track.title}](${track.uri})`,
      },
      {
        name: 'Автор:',
        value: `${track.author}`,
      },
      {
        name: 'Ввімкнено за запитом:',
        value: `${track.requester}`,
      },
      {
        name: 'Статус повтору:',
        value: player.loop === 'none' ? 'Вимкнено' : player.loop === 'queue' ? 'Список відтворення' : 'Один трек',
      }
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
