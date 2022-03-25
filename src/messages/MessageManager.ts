import { Client } from 'discord.js';

export class MessageManager {

  protected readonly prefix: string;

  protected readonly client: Client;

  public constructor(client: Client, prefix: string) {
    this.prefix = prefix;
    this.client = client;
  }

}
