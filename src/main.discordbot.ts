import { Client, Intents, Interaction } from 'discord.js';
import { REST as DiscordAPI } from '@discordjs/rest';

import CommandManager from '@src/commands.discordbot';
import TrackPlayerManager from '@src/commands/audio/track/playermanager.track';

import Play from '@src/commands/audio/play.audiocommand';
import Skip from '@src/commands/audio/skip.audiocommand';
import Info from '@src/commands/common/info.command';
import Covid from '@src/commands/common/covid.command';
import Clear from '@src/commands/audio/clear.audiocommand';
import Queue from '@src/commands/audio/queue.audiocommand';

export default class DiscordBot {

  protected readonly client: Client;

  protected readonly discordAPI: DiscordAPI;

  protected readonly commandManager: CommandManager;

  protected readonly Intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ];

  protected readonly TOKEN: string;

  private readonly trackPlayerManager: TrackPlayerManager = new TrackPlayerManager();

  public constructor(token: string) {
    this.TOKEN = token;
    this.client = new Client({ intents: this.Intents });
    this.discordAPI = new DiscordAPI({ version: '9' }).setToken(token);
    this.commandManager = new CommandManager(this.client, this.discordAPI);
  }

  public async startBot(): Promise<void> {
    this.client.on('ready', await this.onReady.bind(this));
    this.client.on('interactionCreate', await this.onCommand.bind(this));
    this.client.login(this.TOKEN);
  }

  protected async onReady(): Promise<void> {
    console.log(`Logged in as ${this.client.user.tag}!`);

    await this.commandManager.registerCommand([
      new Info(this.client),
      new Covid(this.client),
      new Play(this),
      new Skip(this),
      new Clear(this),
      new Queue(this),
    ]);
  }

  protected async onCommand(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;

    this.commandManager.executeCommand(interaction);
  }

  public getTrackPlayerManager(): TrackPlayerManager {
    return this.trackPlayerManager;
  }

}
