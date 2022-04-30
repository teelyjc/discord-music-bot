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
    const time = new Date();
    await interaction.deferReply();
    await interaction.editReply('Pong !');

    try {
      const ms = (time.getMilliseconds() - new Date().getMilliseconds());
      await interaction.editReply(`Pong ! ${ms} ms`);
    } catch (error: any) {
      await interaction.editReply('PingCommand is unavailable.');
      console.log(`Something went wrong on PingCommand ${error.message}`);
    }
  }

}
