import MainDiscordBot from '@src/MainDiscordBot';
import 'dotenv/config';

const { TOKEN } = process.env;

const PawanaBot = new MainDiscordBot(TOKEN);
PawanaBot.startBot();
