import { Events, type GuildMember } from "discord.js";

import type Client from "@/classes/Client";
import Event from "@/classes/Event";
import logger from "@/utils/logger";
import { Card } from "welcomify";

export default class MemberJoin extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.GuildMemberAdd,
      description: "Member join",
      once: false,
    });
  }

  async Execute(member: GuildMember) {
    const { user, guild, roles } = member;

    const initialRole = guild.roles.cache.get(this.client.GetSetting("join_role_id") ?? "");
    if (initialRole) {
      await roles.add(initialRole, "User joined to server").catch(() => logger.error("Failed to add role"));
    }

    const globalChannel = guild.channels.cache.get(this.client.GetSetting("global_channel_id") ?? "");
    if (!globalChannel?.isTextBased()) return;

    const card = await new Card()
      .setTitle("Вітаємо")
      .setName(user.username)
      .setAvatar(user.displayAvatarURL({ size: 512 }))
      .setMessage(`Нас тепер ${guild.memberCount - 1}`)
      .setBackground("https://s3.eviloma.org/public/discord-bg.jpg")
      .setColor("B79FF4")
      .build();

    await globalChannel
      .send({
        files: [card],
        content: `<@${user.id}>`,
      })
      .catch(() => logger.error("Failed to send card"));
  }
}
