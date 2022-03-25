import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { SlashCommandInfo } from '@src/commands/SlashCommand';
import { CommandInteraction, GuildMember } from 'discord.js';

export default class InfoCommand implements Command {

  public getInfo(): SlashCommandInfo {
    return new SlashCommandBuilder()
      .setName('info')
      .setDescription('get bot info.')
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();
    } catch (error) {
      console.error(error.message);
    }
  }

}
