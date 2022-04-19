import { Video } from 'play-dl/dist/YouTube/classes/Video';

export type SongInfo = {
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
}

export default class GetSongInfo {

  public static getInfo(song: any): SongInfo {
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

    if (song instanceof Video) {
      info.url = song.url;
      info.title = song.title;
      info.thumbnail = song.thumbnail.url;
      info.duration = song.durationInSec;
      info.views = song.views;
      info.author = song.channel.name;
      info.author_avatar = song.channel.icon.url;
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

}
