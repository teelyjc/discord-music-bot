/* eslint-disable no-unused-vars */
/* eslint-disable semi */
import { GuildMember } from 'discord.js';

import TrackInfo from '@src/commands/audio/track/TrackInfo';

export default interface TrackPlayer {

  connect(member: GuildMember): void;

  disconnect(): void;

  isConnected(): boolean;

  play(track: TrackInfo): void;

  next(): boolean;

  queue(track: TrackInfo): void;

  getTracks(): TrackInfo[];

  getCurrentTrack(): TrackInfo;

  getUpcomingTracks(): TrackInfo[];

  clearTracks(): void;

  clearUpcomingTracks(): number;

  removeUpcomingTracks(fromTrackNumber: number, toTrackNumber?: number): boolean;

  skip(amount?: number): boolean;

  pause(): void;

  resume(): void;

  stop(): void;

  isPlaying(): boolean;

}
