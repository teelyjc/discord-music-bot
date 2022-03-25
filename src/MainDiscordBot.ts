import { Interaction, Message, PresenceData } from 'discord.js';
import DiscordBot from '@src/DiscordBot';
import InfoCommand from '@src/commands/common/InfoCommand';
import InfoMessage from '@src/messages/common/InfoMessage';

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

    this.registerCommand();
    this.registerMessage();

    setTimeout(() => {
      console.info(`Logged in as ${this.client.user.tag}`);
    }, 2000);
  }

  protected async onDisconnect(): Promise<void> {
    console.info('See you again, Disconnecting..');
    this.client.destroy();
    process.exit();
  }

  protected async onInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;
    this.commandManager.executeCommand(interaction);
  }

  protected async onMessageCreate(message: Message): Promise<void> {
    this.messageManager.executeMessage(message);
  }

  private registerCommand(): void {
    this.commandManager.registerCommand([
      new InfoCommand(),
    ]);
  }

  private registerMessage(): void {
    this.messageManager.registerMessage([
      new InfoMessage(),
    ]);
  }

}
