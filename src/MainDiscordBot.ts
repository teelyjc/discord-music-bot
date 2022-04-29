import { Client, Intents } from 'discord.js';

export default abstract class MainDiscordBot {

  protected readonly client: Client;

  protected readonly TOKEN: string;

  private Intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]

  public constructor(TOKEN: string) {
    this.TOKEN = TOKEN;
    this.client = new Client({ intents: this.Intents })
  }

  public async build(): Promise<void> {
    await this.client.login(this.TOKEN);

    this.client.on('ready', this.onReady.bind(this))
  }

  protected abstract onReady(): void;

}
