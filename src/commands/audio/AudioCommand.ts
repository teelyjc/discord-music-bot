import PlayerManger from '@src/audio/PlayerManager';
import DiscordInstance from '@src/DiscordInstance';
import Command, { CommandInfo } from '@src/commands/Command';
import { CommandInteraction, GuildMember } from 'discord.js';
import Player from '@src/audio/Player';

export default abstract class AudioCommand implements Command {

  protected readonly discordInstance: DiscordInstance;

  public constructor(discordInstance: DiscordInstance) {
    this.discordInstance = discordInstance;
  }

  public abstract getInfo(): CommandInfo;

  public async execute(interaction: CommandInteraction): Promise<void> {
    try {
      if (!(interaction.member instanceof GuildMember)) return;

      const executor: GuildMember = interaction.member;
      const voiceChannel = executor.voice.channel;

      if (!voiceChannel) {
        await interaction.reply('Please join voice channel to use voice commands.');
      }

      const playerManger: PlayerManger = this.discordInstance.getPlayerManager();
      const player: Player = playerManger.managePlayer(interaction.guildId);

      this.executeAudio(interaction, executor, player);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  protected abstract executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    player: Player,
  ): Promise<void>;

}
