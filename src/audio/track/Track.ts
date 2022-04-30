import { AudioResource, createAudioResource } from '@discordjs/voice';
import GetTrackInfo, { TrackInfo } from '@src/audio/track/TrackInfo';
import { GuildMember } from 'discord.js';
import * as playdl from 'play-dl';

export default class Track {

  private readonly trackKeyword: string;

  private readonly trackRequester: GuildMember;

  private trackInfo: TrackInfo;

  private audioResource: AudioResource;

  private isLoading: boolean = true;

  public constructor(trackKeyword: string, trackRequester: GuildMember) {
    this.trackKeyword = trackKeyword;
    this.trackRequester = trackRequester;
  }

  public async loadTrack(): Promise<void> {
    try {
      const song = (await playdl.search(this.trackKeyword, { limit: 1 }))[0];
      const stream = await playdl.stream(song.url);

      this.trackInfo = GetTrackInfo.getInfo(song);
      this.audioResource = createAudioResource(stream.stream, { inputType: stream.type });

      this.isLoading = false;
    } catch (error: any) {
      throw new Error(`Cannot find any song from ${this.trackKeyword} !`);
    }
  }

  public getTrackRequester(): GuildMember {
    return this.trackRequester;
  }

  public getAudioResource(): AudioResource {
    return this.audioResource;
  }

  public getTrackInfo(): TrackInfo {
    return this.trackInfo;
  }

  public hasLoaded(): boolean {
    return !this.isLoading;
  }

}
