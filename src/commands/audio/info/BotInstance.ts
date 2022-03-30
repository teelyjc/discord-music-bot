import TrackPlayerManager from '@src/commands/audio/track/TrackPlayerManager';

/* eslint-disable semi */
export default interface BotInstance {
  getTrackPlayerManager(): TrackPlayerManager;
}
