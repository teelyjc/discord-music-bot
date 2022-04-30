import PlayerManger from '@src/audio/PlayerManager';
import { Client } from 'discord.js';

/* eslint-disable semi */
export default interface DiscordInstance {
  build(): Promise<void>;

  getPlayerManager(): PlayerManger;

  getClient(): Client;
}
