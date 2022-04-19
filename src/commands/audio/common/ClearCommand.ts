import { SlashCommandBuilder } from '@discordjs/builders';
import AudioCommand from '@src/commands/audio/AudioCommand';
import TrackPlayer from '@src/interfaces/commands/Track/TrackPlayer';
import { CommandInfo } from '@src/interfaces/commands/Command';
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
      ? `${upcomingTracksAmount} was cleared from queue successfully.`
      : 'queue already empty.';
    interaction.reply(replyMessage);
  }

}
