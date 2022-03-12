import { SlashCommandBuilder } from '@discordjs/builders';
import AudioCommand from '@src/commands/audio/command.audio';
import TrackPlayer from '@src/commands/audio/track/player.track';
import { CommandInfo } from '@src/commands/command.common';
import Reply from '@src/commands/delete.interaction';
import { CommandInteraction, GuildMember } from 'discord.js';

export default class Clear extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('clear')
      .setDescription('clear upcoming tracks from queue. 🚫')
      .toJSON();
  }

  public async executeAudioCommand(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const upcomingTracksAmount = trackPlayer.clearUpcomingTracks();
    const replyMessage = upcomingTracksAmount
      ? `${upcomingTracksAmount} was cleared from queue successfully 🙏🏻`
      : 'queue already empty 🙏🏻';
    interaction.reply(replyMessage);
    Reply.delete(interaction, 1);
  }

}
