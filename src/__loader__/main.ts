import DiscordBot from '@src/DiscordBot';
import 'dotenv/config';

const { TOKEN } = process.env;
const discordBot: DiscordBot = new DiscordBot(TOKEN);

discordBot.build();
