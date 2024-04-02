import { EmbedBuilder } from 'discord.js';

import type Client from '@/classes/Client';

export default function DefaultEmbed(client: Client) {
  return new EmbedBuilder()
    .setColor(0x56_20_c0)
    .setTimestamp()
    .setFooter({
      text: client.user?.username ?? 'Unknown user',
      iconURL: client.user?.avatarURL() ?? undefined,
    });
}

export function ErrorEmbed(client: Client, title: string | null, description: string) {
  return DefaultEmbed(client)
    .setColor('Red')
    .setTitle(title ?? 'Помилка')
    .setDescription(`⛔ ${description}`);
}

export function WarningEmbed(client: Client, title: string | null, description: string) {
  return DefaultEmbed(client)
    .setColor('Yellow')
    .setTitle(title ?? 'Попередження')
    .setDescription(`⚠️ ${description}`);
}
