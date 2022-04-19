/* eslint-disable no-unused-vars */
/* eslint-disable semi */
import { CommandInteraction, GuildMember } from 'discord.js';

export type CommandInfo = {
  name: string;
  description: string;
  options: any;
  default_permission: boolean;
}
export default interface Command {
  getInfo(): CommandInfo;

  execute(interaction: CommandInteraction, executor?: GuildMember): Promise<void>;

}
