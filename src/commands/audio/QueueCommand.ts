import { SlashCommandBuilder } from '@discordjs/builders';
import Player from '@src/audio/Player';
import GetTrackInfo from '@src/audio/track/TrackInfo';
import AudioCommand from '@src/commands/audio/AudioCommand';
import { CommandInfo } from '@src/commands/Command';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

export default class QueueCommand extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('queue')
      .setDescription('get all track queue')
      .toJSON();
  }

  protected async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    player: Player,
  ): Promise<void> {
    await interaction.deferReply();
    try {
      const queue = player.getTracks();

      if (queue.length === 0) {
        await interaction.editReply('no track playing.');
        return;
      }

      const queueEmbed = this.QueueEmbed(player);
      await interaction.editReply({ embeds: [queueEmbed] });

    } catch (error: any) {
      console.log(`Something went wrong on QueueCommand ${error.message}`);
      await interaction.editReply('Queue is unavailable.');
    }
  }

  private QueueEmbed(player: Player): MessageEmbed {
    const currentTrack = player.getCurrentTrack();
    const upComingTrack = player.getUpcomingTracks();

    const upcomingDuration = upComingTrack
      .reduce((acc, track) => acc + track.getTrackInfo().duration, 0);
    const totalDuration = currentTrack.getTrackInfo().duration + upcomingDuration;

    return new MessageEmbed()
      .setTitle(currentTrack.getTrackInfo().title)
      .setURL(currentTrack.getTrackInfo().url)
      .setColor('#4c6ce0')
      .setThumbnail(currentTrack.getTrackInfo().thumbnail)
      // eslint-disable-next-line no-nested-ternary
      .addField('Upcoming Track', (player.getTracks().length > 1)
        ? (upComingTrack.length <= 5)
          ? upComingTrack
            .map((track, index) => `${index + 1}.) ${track.getTrackInfo().title}`)
            .join('\n')
          : upComingTrack
            .slice(0, 5)
            .map((track, index) => `${index + 1}.) ${track.getTrackInfo().title}`)
            .join('\n')
            .concat(`\nand ${upComingTrack.length - 5} more tracks.`)
        : 'No upcoming tracks')
      .setFooter({ text: `Total duration: ${GetTrackInfo.getLocaleDuration(totalDuration)}`, iconURL: currentTrack.getTrackInfo().thumbnail })
      .setTimestamp();
  }

}
