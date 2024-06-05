import type Category from "@/enums/Category";

import type ICommandOption from "./ICommandOption";

export default interface ICommandOptions {
  name: string;
  description: string;
  category: Category;
  options: ICommandOption[];
  default_member_permissions: bigint;
  dm_permission: boolean;
  cooldown?: number;
}
