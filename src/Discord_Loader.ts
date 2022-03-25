import MainDiscordBot from '@src/MainDiscordBot';
import { TOKEN } from '../config.json';

TOKEN.forEach((token) => {
  new MainDiscordBot(token)
    .onStart();
});
