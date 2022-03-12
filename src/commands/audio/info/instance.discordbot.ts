import TrackPlayerManager from '@src/commands/audio/track/playermanager.track';

/* eslint-disable semi */
export default interface BotInstance {
  getTrackPlayerManager(): TrackPlayerManager;
}
