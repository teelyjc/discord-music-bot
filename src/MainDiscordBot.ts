import { Interaction, Message, PresenceData } from 'discord.js';
import DiscordBot from '@src/DiscordBot';

import Play from '@src/commands/audio/common/PlayCommand';
import Skip from '@src/commands/audio/common/SkipCommand';
import Clear from '@src/commands/audio/common/ClearCommand';
import Queue from '@src/commands/audio/common/QueueCommand';
import Info from '@src/commands/common/InfoCommand';
import Covid from '@src/commands/common/CovidCommand';
import Help from '@src/messages/common/HelpCommand';

export default class MainDiscordBot extends DiscordBot {

  /* PresenceData config here */
  private readonly Presence: PresenceData = {
    activities: [
      { name: ';;help', type: 'PLAYING' }],
    status: 'online',
  };

  /* When bot ready */
  protected onReady(): void {
    console.log(`👋 Logged in as ${this.client.user.tag}`);
    this.client.user.setPresence(this.Presence);

    this.databaseManager.connect();

    setInterval(() => {
      this.client.user.setPresence(this.Presence);
    }, 5 * 60 * 1000);

    this.commandManager.registerCommand([
      new Play(this),
      new Skip(this),
      new Clear(this),
      new Queue(this),
      new Info(this.client),
      new Covid(this.client),
    ]);

    this.messageManager.register([
      new Help(this.client),
    ]);
  }

  protected async onInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;
    await this.commandManager.executeCommand(interaction);
  }

  protected async onMessageCreate(message: Message<boolean>): Promise<void> {
    this.messageManager.execute(message);
  }

  protected onDisconnect(): void {
    console.log('Logged Out.');
    this.client.destroy();
    process.exit();
  }

}
