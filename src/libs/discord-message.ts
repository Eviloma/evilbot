import { EmbedBuilder } from 'discord.js';

import Client from '../classes/Client';

export function ErrorMessage(client: Client, title: string | null, description: string) {
  return new EmbedBuilder()
    .setColor('Red')
    .setTitle(title ?? 'Помилка')
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: client.user?.username ?? 'Unknown user',
      iconURL: client.user?.avatarURL() ?? undefined,
    });
}

export function Warning(client: Client, title: string | null, description: string) {
  return new EmbedBuilder()
    .setColor('Yellow')
    .setTitle(title ?? 'Попередження')
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: client.user?.username ?? 'Unknown user',
      iconURL: client.user?.avatarURL() ?? undefined,
    });
}
