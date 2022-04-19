import { Message } from 'discord.js';

export type MessageMSG = {
  getName: () => string[];

  execute: (message: Message, split: string[], excludePrefix: string) => Promise<void>;
}
