import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@src/commands/Command';
import { CommandInteraction } from 'discord.js';

export default class PingCommand implements Command {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('ping')
      .setDescription('reply with pong !')
      .toJSON();
  }

  public async execute(
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();
    await interaction.editReply('Pong !');
  }

}
