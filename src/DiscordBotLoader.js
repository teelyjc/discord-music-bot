import MainDiscordBot from '@src/MainDiscordBot';
import 'dotenv/config';

const { TOKEN } = process.env;
new MainDiscordBot(TOKEN).startBot();
