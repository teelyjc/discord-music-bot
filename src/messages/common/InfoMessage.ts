import MessageCommand, { MessageCommandInfo } from '@src/messages/MessageCommand';
import { Message } from 'discord.js';

export default class InfoMessage implements MessageCommand {

  public getInfo(): MessageCommandInfo {
    return 'info';
  }

  public async execute(commandInfo: string, split: string[], message: Message): Promise<void> {
    try {
      await message.reply('bot info !');
    } catch (error) {
      console.error(error.message);
    }
  }

}
