/* eslint-disable semi */
/* eslint-disable no-extra-semi */
import { CommandInteraction, GuildMember } from 'discord.js';

export type SlashCommandInfo = {
  name: string;
}

export default interface SlashCommand {
  getInfo(): SlashCommandInfo;

  execute(interaction: CommandInteraction, executor?: GuildMember): Promise<void>;
};
