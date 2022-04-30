import Track from '@src/audio/track/Track';
import { GuildMember } from 'discord.js';

/* eslint-disable semi */
export default interface Player {
  connect(member: GuildMember): void;
  isConnected(): boolean;
  disconnect(): void;
  queue(track: Track[]): void;
  isConnected(): boolean;
  stop(): void;
  pause(): void;
  resume(): void;
  clearTracks(): void;
  getTracks(): Track[];
  skip(amount: number): boolean;
  getCurrentTrack(): Track;
  getUpcomingTracks(): Track[];
}
