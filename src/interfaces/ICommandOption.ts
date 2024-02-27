import { ApplicationCommandOptionType } from 'discord.js';

export default interface ICommandOption {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
  choices?: { name: string; value: string }[];
  min?: number;
  max?: number;
  required?: boolean;
}
