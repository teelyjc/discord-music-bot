import TrackPlayer from '@src/interfaces/commands/Track/TrackPlayer';
import LocalTrackPlayer from '@src/commands/audio/track/local/LocalTrackPlayer';

export default class TrackPlayerManager {

  private readonly trackPlayerByGuild = new Map<string, TrackPlayer>();

  public getOrCreate(guildID: string): TrackPlayer {
    if (!this.trackPlayerByGuild.has(guildID)) {
      this.trackPlayerByGuild.set(guildID, new LocalTrackPlayer());
    }

    return this.trackPlayerByGuild.get(guildID);
  }

}
