import 'dotenv/config';
import DiscordBot from '@src/main.discordbot';

const { TOKEN } = process.env;

new DiscordBot(TOKEN).startBot();
