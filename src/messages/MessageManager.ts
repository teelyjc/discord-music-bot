import { Client, Message } from 'discord.js';
import MessageCommand from '@src/messages/Message';

export class MessageManager {

  protected readonly client: Client;

  protected readonly prefix: string;

  private messageLabel = new Map<string, MessageCommand>();

  public constructor(client: Client, prefix: string) {
    this.client = client;
    this.prefix = prefix;
  }

  public async registerMessage(messages: MessageCommand[]): Promise<void> {
    const messagesInfo = messages.map((message) => message.getInfo());

    messages.forEach((message) => {
      this.messageLabel.set(message.getInfo(), message);
    });

    console.info(`Messages: ${messagesInfo.join(', ')}`);
    console.info(`Registered ${messages.length} messages successfully`);
  }

  public async executeMessage(message: Message): Promise<void> {
    if (!message.content.startsWith(this.prefix)) return;

    const split: string[] = message.content.split(' ');
    if (split.length === 0) return;

    const commandExcludePrefix = split[0].substring(this.prefix.length);
    const command = this.messageLabel.get(commandExcludePrefix);

    if (!command) return;

    try {
      command.execute(commandExcludePrefix, split, message);
    } catch (error) {
      console.error(error.message);
    }
  }

}
