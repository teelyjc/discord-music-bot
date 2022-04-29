import { Client, Intents } from 'discord.js';
import { REST as DiscordAPI } from '@discordjs/rest';
import CommandManager from '@src/Commands/CommandManager';

export default abstract class MainDiscordBot {

  protected readonly client: Client;

  private readonly discordAPI: DiscordAPI;

  protected readonly commandManager: CommandManager;

  private readonly TOKEN: string;

  private Intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ];

  public constructor(TOKEN: string) {
    this.TOKEN = TOKEN;
    this.client = new Client({ intents: this.Intents });
    this.discordAPI = new DiscordAPI({ version: '9' }).setToken(TOKEN);
    this.commandManager = new CommandManager(this.client, this.discordAPI);

  }

  public async build(): Promise<void> {
    await this.client.login(this.TOKEN);

    this.client.on('ready', this.onReady.bind(this));
  }

  protected abstract onReady(): void;

}
