import PlayerManger from '@src/audio/PlayerManager';

/* eslint-disable semi */
export default interface DiscordInstance {
  build(): Promise<void>;

  getPlayerManager(): PlayerManger;
}
