import { GuildMember } from 'discord.js';
import {
  joinVoiceChannel,
  DiscordGatewayAdapterCreator,
  VoiceConnection,
  AudioPlayer,
  createAudioPlayer,
  AudioPlayerStatus,
} from '@discordjs/voice';
import Player from '@src/audio/Player';
import Track from '@src/audio/track/Track';

export default class DiscordPlayer implements Player {

  private TIMEOUT: number = 1 * 60 * 1000;

  private audioPlayer: AudioPlayer;

  private connection: VoiceConnection;

  private hasConnected: boolean = false;

  private tracks: Track[] = new Array<Track>();

  private hasPlayed: boolean = false;

  private timeout: NodeJS.Timeout;

  private onIdle(): void {
    const hasNextTrack = this.next();

    if (!hasNextTrack) {
      this.timeout = setTimeout(() => this.disconnect(), this.TIMEOUT);
    }
  }

  public async connect(member: GuildMember): Promise<void> {
    this.audioPlayer = createAudioPlayer();
    this.audioPlayer.on(AudioPlayerStatus.Idle, this.onIdle.bind(this));
    this.connection = joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: member.voice.guild.id,
      adapterCreator: member.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
      selfDeaf: false,
    });

    this.connection.subscribe(this.audioPlayer);
    this.hasConnected = true;
  }

  public async play(track: Track): Promise<void> {
    this.audioPlayer.play(track.getAudioResource());
    clearTimeout(this.timeout);
  }

  public queue(track: Track[]): void {
    this.tracks.push(...track);

    if (!this.isPlaying()) {
      this.hasPlayed = true;
      this.play(track[0]);
    }
  }

  public skip(amount: number): boolean {
    if ((amount > this.tracks.length) || amount < 1) return false;

    this.tracks = this.tracks.slice(amount - 1);
    this.stop();

    return true;
  }

  public isConnected(): boolean {
    return this.hasConnected;
  }

  public disconnect(): void {
    this.hasConnected = false;
    this.audioPlayer = null;
    this.hasPlayed = false;
    this.connection.destroy();
  }

  public next(): boolean {
    this.tracks.shift();
    const hasNextTrack = (this.tracks.length !== 0);

    if (hasNextTrack) {
      this.play(this.tracks[0]);
    } else {
      this.stop();
    }

    return hasNextTrack;
  }

  public stop(): void {
    this.audioPlayer.stop(true);
  }

  public pause(): void {
    this.audioPlayer.pause();
  }

  public resume(): void {
    this.audioPlayer.unpause();
  }

  public clearTracks(): void {
    this.tracks = new Array<Track>();
    this.stop();
    this.disconnect();
  }

  public getTracks(): Track[] {
    return this.tracks;
  }

  public getCurrentTrack(): Track {
    return this.tracks[0];
  }

  public getUpcomingTracks(): Track[] {
    return this.tracks.slice(1);
  }

  public isPlaying(): boolean {
    return this.hasPlayed;
  }

}
