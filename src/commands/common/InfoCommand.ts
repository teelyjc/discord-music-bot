import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@src/commands/Command';
import { CommandInteraction, CacheType } from 'discord.js';

export default class InfoCommand implements Command {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .toJSON();
  }

  public execute(interaction: CommandInteraction): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
