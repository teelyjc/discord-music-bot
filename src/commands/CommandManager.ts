import { Client, CommandInteraction } from 'discord.js';
import { REST as DiscordAPI } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import SlashCommand from '@src/commands/SlashCommand';

export class CommandManager {

  protected readonly client: Client;
  protected readonly discordAPI: DiscordAPI;

  private commandLabel = new Map<string, SlashCommand>();

  public constructor(client: Client, discordAPI: DiscordAPI) {
    this.client = client;
    this.discordAPI = discordAPI;
  }

  public async registerCommand(commands: SlashCommand[]): Promise<void> {
    try {
      const { application } = this.client;

      const registeredCommands = await application.commands.fetch();
      const registeredCommandsName = registeredCommands.map((info) => info.name).sort();

      const commandsInfo = commands.map((command) => command.getInfo());
      const commandsName = commandsInfo.map((info) => info.name).sort();

      const hasToRegister = (
        (registeredCommandsName.length !== commandsName.length)
        || !(commandsName.every((command) => registeredCommandsName.includes(command)))
      );

      if (hasToRegister) {
        await this.discordAPI.put(
          Routes
            .applicationCommands(application.id),
          { body: commandsInfo },
        );

        const addition = commandsName
          .filter((command) => !registeredCommandsName.includes(command)).length;

        const deletion = registeredCommandsName
          .filter((command) => !commandsName.includes(command))
          .length;

        if (addition) {
          console.info(`Registered new ${addition} SlashCommands to Discord successfully`);
        } else {
          console.info(`Unregistered ${deletion} SlashCommands from Discord successfully`);
        }
      }

      commands.forEach((command) => {
        this.commandLabel.set(command.getInfo().name, command);
      });

      console.info(`Slash Commands: ${commandsName.join(', ')}`);
      console.info(`Registered ${commands.length} SlashCommands in-memory successfully`);

    } catch (error) {
      console.error(error.message);
    }
  }

  public async executeCommand(interaction: CommandInteraction): Promise<void> {
    const command: SlashCommand = this.commandLabel.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error.message);
    }
  }

}
