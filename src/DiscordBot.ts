import {
  Client,
  Intents,
  Interaction,
  Message,
} from 'discord.js';

import { REST as DiscordAPI } from '@discordjs/rest';
import CommandManager from '@src/commands/CommandManager';
import TrackPlayerManager from '@src/commands/audio/track/TrackPlayerManager';
import { MessageManager } from '@src/messages/MessageManager';

export default abstract class DiscordBot {

  protected readonly client: Client;

  protected readonly discordAPI: DiscordAPI;

  protected readonly Intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ];

  private readonly TOKEN: string;

  private readonly trackPlayerManager: TrackPlayerManager = new TrackPlayerManager();

  protected readonly commandManager: CommandManager;

  protected readonly messageManager: MessageManager;

  public constructor(token: string) {
    this.TOKEN = token;
    this.client = new Client({ intents: this.Intents });
    this.discordAPI = new DiscordAPI({ version: '9' }).setToken(token);
    this.commandManager = new CommandManager(this.client, this.discordAPI);
    this.messageManager = new MessageManager(this.client, ';;');
  }

  public async startBot(): Promise<void> {
    console.log('Loading all resource, Logging in..');
    await this.client.login(this.TOKEN);
    this.client.on('ready', await this.onReady.bind(this));
    this.client.on('interactionCreate', await this.onInteractionCreate.bind(this));
    this.client.on('messageCreate', this.onMessageCreate.bind(this));
    process.on('SIGINT', this.onDisconnect.bind(this));
  }

  public getTrackPlayerManager(): TrackPlayerManager {
    return this.trackPlayerManager;
  }

  protected abstract onInteractionCreate(interaction: Interaction): Promise<void>

  protected abstract onMessageCreate(message: Message): Promise<void>

  protected abstract onReady(): void

  protected abstract onDisconnect(): void

}
