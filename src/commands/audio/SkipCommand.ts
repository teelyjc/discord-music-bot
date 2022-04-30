import { SlashCommandBuilder } from '@discordjs/builders';
import Player from '@src/audio/Player';
import Track from '@src/audio/track/Track';
import AudioCommand from '@src/commands/audio/AudioCommand';
import { CommandInfo } from '@src/commands/Command';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

export default class SkipCommand extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('skip')
      .setDescription('skip songs')
      .addIntegerOption((option) => option
        .setName('amount')
        .setDescription('amount songs to skip')
        .setRequired(false))
      .toJSON();
  }

  protected async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    player: Player,
  ): Promise<void> {
    await interaction.deferReply();
    try {
      const skipAmount = (interaction.options.getInteger('amount')) || 1;
      const isSkipped = player.skip(skipAmount);

      if (!isSkipped) {
        await interaction.editReply('no song to skip.');
        return;
      }

      const remainingTracks = player.getTracks().length;

      if (remainingTracks === 0) {
        await interaction.editReply('Skip to the end of tracks');
      } else {
        const skipEmbed = this.SkipEmbed(executor, player.getCurrentTrack());
        await interaction.editReply({ embeds: [skipEmbed] });
      }

    } catch (error: any) {
      console.log(`Something went wrong on SkipCommand ${error.message}`);
      await interaction.editReply('Skip is unavailable.');
    }
  }

  private SkipEmbed(executor: GuildMember, track: Track): MessageEmbed {
    return new MessageEmbed()
      .setColor('#4c6ce0')
      .setTitle(`${track.getTrackInfo().title}`)
      .setURL(track.getTrackInfo().url)
      .setThumbnail(track.getTrackInfo().thumbnail)
      .addFields(
        {
          name: 'Requester',
          value: executor.user.tag,
          inline: true,
        },
        {
          name: 'Duration',
          value: track.getTrackInfo().duration_locale,
          inline: true,
        },
      )
      .setFooter({ text: track.getTrackInfo().author, iconURL: track.getTrackInfo().thumbnail })
      .setTimestamp();
  }

}
