import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

import AudioCommand from '@src/commands/audio/command.audio';
import TrackPlayer from '@src/commands/audio/track/player.track';
import { CommandInfo } from '@src/commands/command.common';
import GetSongInfo from '@src/commands/audio/info/info.song';
import TrackInfo from '@src/commands/audio/track/info.track';
import Reply from '@src/commands/delete.interaction';

export default class Queue extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('queue')
      .setDescription('list all track and upcoming track 🎶')
      .toJSON();
  }

  public async executeAudioCommand(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    try {
      if (trackPlayer.getTracks().length === 0) {
        interaction.reply('no track playing ! 🙅🏻‍♀️');
        Reply.delete(interaction, 1);
        return;
      }

      interaction.reply({ embeds: [this.getTrackListEmbed(trackPlayer)] });
      Reply.delete(interaction, 1);
    } catch (error: any) {
      interaction.editReply('Somethings went wrong, please try again later. ❌');
      Reply.delete(interaction, 1);
      console.log(error.message);
    }
  }

  private getTrackListEmbed(trackPlayer: TrackPlayer): MessageEmbed {
    const currentTrack = trackPlayer.getCurrentTrack();
    const upcomingTracks = trackPlayer.getUpcomingTracks();

    const upcomingTotalDuration = upcomingTracks
      .reduce((acc, track) => acc + track.getInfo().duration, 0);

    const totalDuration: number = currentTrack.getInfo().duration + upcomingTotalDuration;

    return new MessageEmbed()
      .setColor('#0086cf')
      .setTitle('Queue 👑')
      .addField('current ▶️', this.formatTrackQueue([currentTrack]))
      .addField('upcoming ⤴️', (upcomingTracks.length !== 0)
        ? this.formatTrackQueue(upcomingTracks, true)
        : 'no upcoming track')
      .setFooter({ text: `total duration: ${GetSongInfo.getLocaleDuration(totalDuration)}` });
  }

  private formatTrackQueue(tracks: TrackInfo[], prefix?: boolean): string {
    const template = '%prefix% `[%duration%]` [%title%](%url%) by <@%by%>';

    return tracks
      .map((track, index) => template
        .replace('%prefix%', prefix ? `\`${(index + 1)}\`.` : '')
        .replace('%duration%', track.getInfo().duration_locale)
        .replace('%title%', track.getInfo().title)
        .replace('%url%', track.getInfo().url)
        .replace('%by%', track.getRequestedBy().id))
      .join('\n');
  }

}
