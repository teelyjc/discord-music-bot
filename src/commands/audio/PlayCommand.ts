import GetTrackInfo, { Playlist } from '@src/audio/track/TrackInfo';
import { SlashCommandBuilder } from '@discordjs/builders';
import Player from '@src/audio/Player';
import Track from '@src/audio/track/Track';
import AudioCommand from '@src/commands/audio/AudioCommand';
import { CommandInfo } from '@src/commands/Command';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

export default class PlayCommand extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('play')
      .setDescription('add music in queue or play')
      .addStringOption((option) => option
        .setName('song')
        .setDescription('song name or link')
        .setRequired(true))
      .toJSON();
  }

  protected async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    player: Player,
  ): Promise<void> {
    const keyword = interaction.options.getString('song');
    try {
      await interaction.deferReply();

      if (!player.isConnected()) {
        player.connect(executor);
      }

      const playlist: Playlist = await GetTrackInfo.getPlaylist(keyword);
      let tracks: Track[] = [];

      if (playlist) {
        tracks = playlist.videoUrls.map((url) => new Track(url, executor));
      } else {
        tracks.push(new Track(keyword, executor));
      }

      await Promise.all(tracks.map((track) => track.loadTrack()));
      player.queue(tracks);

      console.log(
        (playlist)
          ? `Server ${executor.guild.name} added a playlist ${playlist.title} ${tracks.length} tracks, by ${executor.displayName}!`
          : `Server ${executor.guild.name} added ${tracks[0].getTrackInfo().title} to server's queue, by ${executor.displayName}!`,
      );

      const songEmbed = (!playlist)
        ? this.SongEmbed(executor, tracks[0])
        : this.playlistEmbed(executor, playlist, tracks);

      await interaction.editReply({ embeds: [songEmbed] });
    } catch (error: any) {
      await interaction.editReply('This track or playlist is unavailable !');
      console.log(`Something went wrong on PlayCommand ${error.message}`);
    }
  }

  private SongEmbed(executor: GuildMember, trackInfo: Track): MessageEmbed {
    const {
      title,
      url,
      thumbnail,
      duration_locale,
      author,
      author_avatar,
    } = trackInfo.getTrackInfo();

    return new MessageEmbed()
      .setColor('#4c6ce0')
      .setTitle(title)
      .setURL(url)
      .setThumbnail(thumbnail)
      .addFields(
        {
          name: 'Requester',
          value: executor.user.tag,
          inline: true,
        },
        {
          name: 'Duration',
          value: duration_locale,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: author, iconURL: author_avatar });
  }

  private playlistEmbed(
    executor: GuildMember,
    playlist: Playlist,
    allTrack: Track[],
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor('#4c6ce0')
      .setTitle(playlist.title)
      .setURL(playlist.url)
      .addFields(
        {
          name: 'Playlist Length',
          value: allTrack.length.toString(),
          inline: true,
        },
        {
          name: 'Duration',
          value: playlist.duration_locale,
          inline: true,
        },
        {
          name: 'Requester',
          value: executor.user.tag,
          inline: false,
        },
      )
      .setTimestamp()
      .setFooter({ text: playlist.creator_name, iconURL: playlist.creator_avatar });
  }

}
