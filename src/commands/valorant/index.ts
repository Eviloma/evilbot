import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";

import type Client from "@/classes/Client";
import Command from "@/classes/Command";
import Category from "@/enums/Category";

export default class Valorant extends Command {
  constructor(client: Client) {
    super(client, {
      name: "valorant",
      description: "Valorant commands",
      category: Category.Valorant,
      options: [
        {
          name: "link",
          description: "Link your discord account to your Valorant account",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }
}
