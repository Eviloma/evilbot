import { type Client, EmbedBuilder } from "discord.js";

export function getDefaultEmbed(c: Client) {
  return new EmbedBuilder()
    .setColor(0x5620c0)
    .setTimestamp()
    .setFooter({
      text: c.user?.username ?? "Unknown",
      iconURL: c.user?.avatarURL() ?? undefined,
    });
}

export function getWarningEmbed(c: Client, title: string | null, description: string) {
  return getDefaultEmbed(c)
    .setColor("Red")
    .setTitle(title ?? "Warning")
    .setDescription(`⛔ ${description}`);
}

export function getErrorEmbed(c: Client, title: string | null, description: string) {
  return getDefaultEmbed(c)
    .setColor("Yellow")
    .setTitle(title ?? "Error")
    .setDescription(`⚠️ ${description}`);
}
