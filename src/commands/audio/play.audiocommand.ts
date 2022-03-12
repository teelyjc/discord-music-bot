import AudioCommand from '@src/commands/audio/command.audio';
import { CommandInfo } from '@src/commands/command.common';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SongInfo } from '@src/commands/audio/info/info.song';
import TrackInfo from '@src/commands/audio/track/info.track';
import TrackPlayer from '@src/commands/audio/track/player.track';
import Reply from '@src/commands/delete.interaction';

export default class Play extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('play')
      .setDescription('add queue and play. 🎵')
      .addStringOption((option) => option
        .setName('song')
        .setDescription('song name or song link.')
        .setRequired(true))
      .toJSON();
  }

  public async executeAudioCommand(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const song = interaction.options.getString('song');
    try {
      await interaction.deferReply();

      if (!trackPlayer.isConnected()) {
        trackPlayer.connect(executor);
      }

      const track = new TrackInfo(song, executor);
      await track.loadResource();
      trackPlayer.queue(track);

      const replyMessage = this.getReplyEmbed(executor, track.getInfo());
      interaction.editReply({ embeds: [replyMessage] });

      Reply.delete(interaction, 1);

      console.log(`Server '${executor.guild.name}' plays: ${track.getInfo().title}`);
    } catch (error: any) {
      interaction.editReply('Somethings went wrong, please try again later. ❌');
      Reply.delete(interaction, 1);
      console.log(`Something went wrong on song ${song}: ${error.name}`);
    }
  }

  private getReplyEmbed(
    executor: GuildMember,
    songInfo: SongInfo,
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor('#0086cf')
      .setTitle(songInfo.title)
      .setURL(songInfo.url)
      .setThumbnail(songInfo.thumbnail)
      .addFields(
        {
          name: 'Duration ⏰',
          value: songInfo.duration_locale,
          inline: true,
        },
        {
          name: 'Requested By 🙆‍♂️',
          value: `${executor.displayName} #${executor.user.discriminator}`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: songInfo.author, iconURL: songInfo.author_avatar });
  }

}
