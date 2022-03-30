/* eslint-disable no-unused-vars */
import { CommandInteraction, GuildMember } from 'discord.js';

import Command, { CommandInfo } from '@src/commands/Command';
import TrackPlayer from '@src/commands/audio/track/TrackPlayer';
import BotInstance from '@src/commands/audio/info/BotInstance';

export default abstract class AudioCommand implements Command {

  private readonly botInstance: BotInstance;

  public constructor(botinstance) {
    this.botInstance = botinstance;
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    if (!(interaction.member instanceof GuildMember)) return;

    const executor = interaction.member;
    const voiceChannel = executor.voice.channel;

    if (!voiceChannel) {
      interaction.reply('Please join voice channel to use voice commands.');
      return;
    }

    const trackPlayerManager = this.botInstance.getTrackPlayerManager();
    const trackPlayer = trackPlayerManager.getOrCreate(interaction.guildId);

    this.executeAudioCommand(interaction, executor, trackPlayer);
  }

  public abstract getInfo(): CommandInfo;

  public abstract executeAudioCommand(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void>;

}
