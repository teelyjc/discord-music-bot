import { Client, Intents, Interaction, Message } from 'discord.js';
import { REST as DiscordAPI } from '@discordjs/rest';
import { CommandManager } from '@src/commands/CommandManager';
import { MessageManager } from '@src/messages/MessageManager';

export default abstract class DiscordBot {

  protected readonly client: Client;

  protected readonly discordAPI: DiscordAPI;

  protected readonly intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ];

  private readonly token: string;

  protected readonly commandManager: CommandManager;
  protected readonly messageManager: MessageManager;

  public constructor(token: string) {
    console.info('Loading all resource, Logging in..');
    this.token = token;
    this.client = new Client({ intents: [this.intents] });
    this.discordAPI = new DiscordAPI({ version: '9' }).setToken(token);
    this.commandManager = new CommandManager(this.client, this.discordAPI);
    this.messageManager = new MessageManager(this.client, ';;');
  }

  public async onStart(): Promise<void> {
    await this.client.login(this.token);
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
    this.client.on('messageCreate', this.onMessageCreate.bind(this));
    process.on('SIGINT', this.onDisconnect.bind(this));
  }

  protected abstract onReady(): Promise<void>;

  protected abstract onDisconnect(): Promise<void>;

  protected abstract onInteractionCreate(interaction: Interaction): Promise<void>;

  protected abstract onMessageCreate(message: Message): Promise<void>;

}
