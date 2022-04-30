import {
  Client, Guild, Intents, Interaction,
} from 'discord.js';

import { REST as DiscordAPI } from '@discordjs/rest';
import CommandManager from '@src/commands/CommandManager';
import PlayerManger from '@src/audio/PlayerManager';
import DiscordInstance from '@src/DiscordInstance';

export default abstract class MainDiscordBot implements DiscordInstance {

  protected readonly client: Client;

  private readonly discordAPI: DiscordAPI;

  protected readonly commandManager: CommandManager;

  protected readonly playerManager: PlayerManger;

  private readonly TOKEN: string;

  private Intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ];

  public constructor(TOKEN: string) {
    this.TOKEN = TOKEN;
    this.client = new Client({ intents: this.Intents });
    this.discordAPI = new DiscordAPI({ version: '9' }).setToken(TOKEN);
    this.commandManager = new CommandManager(this.client, this.discordAPI);
    this.playerManager = new PlayerManger();
  }

  public async build(): Promise<void> {
    await this.client.login(this.TOKEN);

    this.client.on('ready', this.onReady.bind(this));
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
    this.client.on('guildCreate', this.onGuildCreate.bind(this));
  }

  public getPlayerManager(): PlayerManger {
    return this.playerManager;
  }

  public getClient(): Client {
    return this.client;
  }

  protected abstract onReady(): void;

  protected abstract onInteractionCreate(interaction: Interaction): void;

  protected abstract onGuildCreate(guild: Guild): void;

}
