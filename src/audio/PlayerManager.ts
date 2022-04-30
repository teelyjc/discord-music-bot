import DiscordPlayer from '@src/audio/DiscordPlayer';
import Player from '@src/audio/Player';

export default class PlayerManger {

  private readonly guildPlayer:
    Map<string, Player> = new Map<string, Player>();

  public managePlayer(guildID: string): Player {
    if (!this.guildPlayer.has(guildID)) {
      this.guildPlayer.set(guildID, new DiscordPlayer());
    }

    return this.guildPlayer.get(guildID);
  }

}
