import { MessageMSG } from '@src/interfaces/messages/Message';
import { Client, Message } from 'discord.js';

export default class Help implements MessageMSG {

  protected readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  public getName(): string[] {
    return ['help', 'h'];
  }

  public async execute(
    message: Message<boolean>,
    split: string[],
    excludePrefix: string,
  ): Promise<void> {
    message.reply('type / to check all available commands !');
  }

}
