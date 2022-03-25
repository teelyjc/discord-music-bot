import { Interaction, Message, PresenceData } from 'discord.js';
import DiscordBot from '@src/DiscordBot';

export default class MainDiscordBot extends DiscordBot {

  private readonly Precense: PresenceData = {
    activities: [
      { name: 'Under Construction' },
    ],
    status: 'dnd',
  };

  protected async onReady(): Promise<void> {
    this.client.user.setPresence(this.Precense);

    setInterval(() => {
      this.client.user.setPresence(this.Precense);
    }, 5 * 60 * 1000);

    console.info(`Logged in as ${this.client.user.tag}`);
  }

  protected async onDisconnect(): Promise<void> {
    this.client.destroy();
    console.info('See you again, Disconnecting..');
    process.exit();
  }

  protected async onInteractionCreate(interaction: Interaction): Promise<void> {
    console.warn('Method not Implements');
  }

  protected async onMessageCreate(message: Message): Promise<void> {
    console.warn('Method not Implements');
  }

}
