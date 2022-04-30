import ClearCommand from '@src/commands/audio/ClearCommand';
import PlayCommand from '@src/commands/audio/PlayCommand';
import QueueCommand from '@src/commands/audio/QueueCommand';
import SkipCommand from '@src/commands/audio/SkipCommand';
import InfoCommand from '@src/commands/common/InfoCommand';
import InviteCommand from '@src/commands/common/InviteCommand';
import PingCommand from '@src/commands/common/PingCommand';
import MainDiscordBot from '@src/MainDiscordBot';
import { Guild, Interaction } from 'discord.js';

export default class DiscordBot extends MainDiscordBot {

  protected onReady(): void {
    console.log(`Logged in as ${this.client.user.tag}!`);

    this.commandManager.registerCommand([
      new PingCommand(),
      new PlayCommand(this),
      new ClearCommand(this),
      new QueueCommand(this),
      new SkipCommand(this),
      new InviteCommand(this),
      new InfoCommand(this),
    ]);
  }

  protected async onInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;
    await this.commandManager.executeCommand(interaction);
  }

  protected onGuildCreate(guild: Guild): void {
    console.log(`Join ${guild.name}. !`);
  }

}
