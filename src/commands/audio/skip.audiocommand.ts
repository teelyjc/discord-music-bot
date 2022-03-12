import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import AudioCommand from '@src/commands/audio/command.audio';
import TrackPlayer from '@src/commands/audio/track/player.track';
import { SongInfo } from '@src/commands/audio/info/info.song';
import { CommandInfo } from '@src/commands/command.common';
import Reply from '@src/commands/delete.interaction';

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
        Reply.delete(interaction, 1);
        return;
      }

      const remainingTracks = trackPlayer.getTracks().length;

      if (remainingTracks === 0) {
        interaction.reply('skipped to the end of queue.');
        Reply.delete(interaction, 1);
      } else {
        const replyEmbed = this.getReplyEmbed(executor, trackPlayer.getCurrentTrack().getInfo());
        interaction.reply({ content: 'skipped to', embeds: [replyEmbed] });
        Reply.delete(interaction, 1);
      }
    } catch (error) {
      interaction.editReply('Somethings went wrong, please try again later. ❌');
      Reply.delete(interaction, 1);
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
