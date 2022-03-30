/* eslint-disable semi */
/* eslint-disable no-extra-semi */
import { Message } from 'discord.js';

export type MessageCommandInfo = string;

export default interface MessageCommand {
  getInfo(): MessageCommandInfo;

  execute(commandInfo: string, split: string[], message: Message): Promise<void>;

};
