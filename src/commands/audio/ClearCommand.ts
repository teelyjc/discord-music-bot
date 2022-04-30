import { SlashCommandBuilder } from '@discordjs/builders';
import Player from '@src/audio/Player';
import AudioCommand from '@src/commands/audio/AudioCommand';
import { CommandInfo } from '@src/commands/Command';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

export default class ClearCommand extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('clear')
      .setDescription('clear playlist')
      .toJSON();
  }

  protected async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    player: Player,
  ): Promise<void> {
    await interaction.deferReply();
    try {
      if (player.getTracks().length < 1) {
        await interaction.editReply('no track in queue to clear.');
        return;
      }

      player.clearTracks();
      const messageEmbed = this.MessageEmbed(executor);
      await interaction.editReply({ embeds: [messageEmbed] });

    } catch (error: any) {
      console.log(`Something went wrong on ClearCommand ${error.message}`);
      await interaction.editReply('Clear is unavailable.');
    }
  }

  private MessageEmbed(executor: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor('#4c6ce0')
      .setTitle(`Clear by ${executor.user.tag}`)
      .setTimestamp();
  }

}
