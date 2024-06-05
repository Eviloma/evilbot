import type { ChatInputCommandInteraction } from "discord.js";

import type Category from "@/enums/Category";
import type ICommand from "@/interfaces/ICommand";
import type ICommandOption from "@/interfaces/ICommandOption";
import type ICommandOptions from "@/interfaces/ICommandOptions";

import type Client from "./Client";

export default class Command implements ICommand {
  client: Client;

  name: string;

  description: string;

  category: Category;

  options: ICommandOption[];

  default_member_permissions: bigint;

  dm_permission: boolean;

  cooldown: number;

  constructor(client: Client, options: ICommandOptions) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.category = options.category;
    this.options = options.options;
    this.default_member_permissions = options.default_member_permissions;
    this.dm_permission = options.dm_permission;
    this.cooldown = options.cooldown ?? 3;
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    throw new Error(`Execute not implemented in ${interaction.command?.name} command`);
  }
}
