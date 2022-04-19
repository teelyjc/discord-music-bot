import { AudioResource, createAudioResource } from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import * as PlayDL from 'play-dl';

import GetSongInfo, { SongInfo } from '@src/commands/audio/info/GetSongInfo';

export default class TrackInfo {

  private readonly searchTitle: string;

  private readonly requestedBy: GuildMember;

  private trackInfo: SongInfo;

  private audioResource: AudioResource;

  private isLoading: boolean = true;

  public constructor(searchTitle: string, requestedBy: GuildMember) {
    this.searchTitle = searchTitle;
    this.requestedBy = requestedBy;
  }

  public async loadResource(): Promise<void> {
    try {
      const song = (await PlayDL.search(this.searchTitle, { limit: 1 }))[0];
      const stream = await PlayDL.stream(song.url);

      this.trackInfo = GetSongInfo.getInfo(song);
      this.audioResource = createAudioResource(stream.stream, { inputType: stream.type });
      this.isLoading = false;
    } catch (error: any) {
      throw new Error(`Can't find any song resource from ${this.searchTitle}`);
    }
  }

  public getRequestedBy(): GuildMember {
    return this.requestedBy;
  }

  public getResource(): AudioResource {
    return this.audioResource;
  }

  public getInfo(): SongInfo {
    return this.trackInfo;
  }

  public hasLoaded(): boolean {
    return !this.isLoading;
  }

}
