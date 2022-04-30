import { YouTubeVideo } from 'play-dl';
import * as playdl from 'play-dl';

export type TrackInfo = {
  url: string,
  title: string,
  thumbnail: string,
  duration: number,
  views: number,
  duration_locale: string,
  author: string,
  author_avatar: string,
  author_url: string,
  verify: boolean,
};

export type Playlist = {
  title: string,
  creator_name: string,
  creator_url: string,
  creator_avatar: string,
  url: string,
  videoUrls: string[],
  duration: number,
  duration_locale: string,
};

export default class GetTrackInfo {

  public static getInfo(song: any): TrackInfo {
    const info = {
      url: null,
      title: null,
      thumbnail: null,
      duration: null,
      views: null,
      duration_locale: null,
      author: null,
      author_avatar: null,
      author_url: null,
      verify: null,
    };

    if (song instanceof YouTubeVideo) {
      info.url = song.url;
      info.title = song.title;
      info.thumbnail = song.thumbnails.at(-1).url;
      info.duration = song.durationInSec;
      info.views = song.views;
      info.author = song.channel.name;
      info.author_avatar = song.channel.icons[0].url;
      info.author_url = song.channel.url;
      info.verify = song.channel.verified;
    }

    info.duration_locale = this.getLocaleDuration(info.duration);

    return info;
  }

  public static getLocaleDuration(duration: number): string {
    let timeString = new Date(duration * 1000).toISOString();

    timeString = (duration < 3600) ? timeString.substr(14, 5) : timeString.substr(11, 8);

    return timeString.startsWith('0') ? timeString.substring(1) : timeString;
  }

  public static async getPlaylist(keyword: string): Promise<Playlist> {
    try {
      if (!keyword.startsWith('https') || playdl.yt_validate(keyword) !== 'playlist') {
        throw new Error('This keyword is not a youtube playlist');
      }

      const playlistURL = new URL(keyword);

      const playlist = await playdl.playlist_info(playlistURL.toString(), { incomplete: true });
      const videos = await playlist.all_videos();

      const totalDuration = videos
        .map((video) => video.durationInSec)
        .reduce((total, sec) => total + sec, 0);

      const playlistInfo: Playlist = {
        title: playlist.title,
        creator_name: playlist.channel.name ?? '-',
        creator_url: playlist.channel.url,
        creator_avatar: playlist.channel.icons[0].url,
        url: playlist.url,
        duration: totalDuration,
        duration_locale: this.getLocaleDuration(totalDuration),
        videoUrls: videos.map((video) => video.url),
      };

      return playlistInfo;
    } catch (error: Error | any) {
      return null;
    }
  }

}
