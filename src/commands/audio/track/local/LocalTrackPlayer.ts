/* eslint-disable no-array-constructor */
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember } from 'discord.js';

import TrackPlayer from '@src/commands/audio/track/TrackPlayer';
import TrackInfo from '@src/commands/audio/track/TrackInfo';

export default class LocalTrackPlayer implements TrackPlayer {

  public static readonly TIMEOUT = 1000 * 60 * 1;

  private audioPlayer: AudioPlayer;

  private connection: VoiceConnection;

  private tracks: TrackInfo[] = new Array<TrackInfo>();

  private hasConnected: boolean = false;

  private hasPlayed: boolean = false;

  private timeout: NodeJS.Timeout;

  private onIdle() {
    const hasNextTrack = this.next();

    if (!hasNextTrack) {
      this.timeout = setTimeout(() => this.disconnect(), LocalTrackPlayer.TIMEOUT);
    }
  }

  public connect(member: GuildMember): void {
    this.audioPlayer = createAudioPlayer();
    this.audioPlayer.on(AudioPlayerStatus.Idle, this.onIdle.bind(this));

    this.connection = joinVoiceChannel({
      channelId: member.voice.channelId,
      guildId: member.guild.id,
      adapterCreator: member.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.disconnect();
    });

    this.connection.subscribe(this.audioPlayer);
    this.hasConnected = true;
  }

  public disconnect(): void {
    clearTimeout(this.timeout);
    this.clearTracks();
    this.hasConnected = false;
    this.hasPlayed = false;
    this.audioPlayer = null;
    this.connection.destroy();
  }

  public isConnected(): boolean {
    return this.hasConnected;
  }

  public queue(track: TrackInfo): void {
    this.tracks.push(track);

    if (this.tracks.length === 1) {
      this.play(track);
    }
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

  public skip(amount?: number): boolean {
    if ((amount > this.tracks.length) || (amount < 1)) return false;

    this.tracks = this.tracks.slice(amount - 1);
    this.stop();

    return true;
  }

  public play(track: TrackInfo): void {
    this.audioPlayer.play(track.getResource());
    clearTimeout(this.timeout);
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

  public isPlaying(): boolean {
    return this.hasPlayed;
  }

  public clearTracks(): void {
    this.tracks = new Array<TrackInfo>();
  }

  public getTracks(): TrackInfo[] {
    return this.tracks;
  }

  public getCurrentTrack(): TrackInfo {
    return this.tracks[0];
  }

  public getUpcomingTracks(): TrackInfo[] {
    return this.tracks.slice(1);
  }

  public clearUpcomingTracks(): number {
    const upcomingTracksAmount = this.getUpcomingTracks().length;

    this.tracks.length = upcomingTracksAmount ? 1 : 0;

    return upcomingTracksAmount;
  }

  public removeUpcomingTracks(
    fromTrackNumber: number,
    toTrackNumber: number = fromTrackNumber,
  ): boolean {
    const isValidRange = fromTrackNumber > 0 && toTrackNumber >= fromTrackNumber;

    if (!isValidRange) return false;

    if (toTrackNumber > this.getUpcomingTracks().length) return false;

    this.tracks.splice(fromTrackNumber, toTrackNumber - fromTrackNumber + 1);

    return true;
  }

}
