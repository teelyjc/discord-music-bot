import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import AudioCommand from '@src/commands/audio/AudioCommand';
import TrackPlayer from '@src/interfaces/commands/Track/TrackPlayer';
import { SongInfo } from '@src/interfaces/commands/info/GetSongInfo';
import { CommandInfo } from '@src/interfaces/commands/Command';

export default class Skip extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('skip')
      .setDescription('skip th current song. ⏭️')
      .addIntegerOption((option) => option
        .setName('amount')
        .setDescription('amount of song to skip'))
      .toJSON();
  }

  public async executeAudioCommand(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const skipAmount = (interaction.options.getInteger('amount') || 1);
    const isSkipped = trackPlayer.skip(skipAmount);

    try {
      if (!isSkipped) {
        interaction.reply('no song to skip');
        return;
      }

      const remainingTracks = trackPlayer.getTracks().length;

      if (remainingTracks === 0) {
        interaction.reply('skipped to the end of queue.');
      } else {
        const replyEmbed = this.getReplyEmbed(executor, trackPlayer.getCurrentTrack().getInfo());
        interaction.reply({ content: 'skipped to', embeds: [replyEmbed] });
      }
    } catch (error) {
      interaction.editReply('Somethings went wrong, please try again later. ❌');
      console.log(error.message);
    }
  }

  private getReplyEmbed(executor: GuildMember, songInfo: SongInfo): MessageEmbed {
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
          name: 'Skipped by 🙆‍♂️',
          value: `${executor.displayName} #${executor.user.discriminator}`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: songInfo.author, iconURL: songInfo.author_avatar });
  }

}
