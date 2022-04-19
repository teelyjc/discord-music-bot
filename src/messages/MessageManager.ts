import { Message } from 'discord.js';
import { MessageMSG } from '@src/interfaces/messages/Message';

export default class MessageManager {

  protected readonly prefix: string;

  protected commandLabel: Map<string[], MessageMSG> = new Map<string[], MessageMSG>();

  public constructor(prefix: string) {
    this.prefix = prefix;
  }

  public register(commands: MessageMSG[]): void {
    const allCommand = commands.map((command) => command.getName()[0]);

    commands.forEach((command) => {
      this.commandLabel.set(command.getName(), command);
    });

    console.log(`✅ Registered ${this.commandLabel.size} commands in cache-memory successful. !`);
    console.log(`✅ Avaliable commands: ${allCommand.join(', ')}`);
  }

  public execute(message: Message): void {
    if (!message.content.startsWith(this.prefix)) return;

    const split: string[] = message.content.split(' ');
    const excludePrefix: string = split[0].substring(this.prefix.length);

    this.commandLabel.forEach((cmd) => {
      if (!cmd.getName().includes(excludePrefix)) return;
      cmd.execute(message, split, excludePrefix);
    });
  }

}
