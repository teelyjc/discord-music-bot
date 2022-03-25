import { Client } from 'discord.js';
import { REST as DiscordAPI } from '@discordjs/rest';

export class CommandManager {

  protected readonly client: Client;
  protected readonly discordAPI: DiscordAPI;

  public constructor(client: Client, discordAPI: DiscordAPI) {
    this.client = client;
    this.discordAPI = discordAPI;
  }

}
