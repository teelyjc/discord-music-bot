import { REST as DiscordAPI } from '@discordjs/rest';
import Command from '@src/commands/Command';
import { Client, CommandInteraction } from 'discord.js';
import { Routes } from 'discord-api-types/v9';

export default class CommandManager {

  private readonly client: Client;

  private readonly discordAPI: DiscordAPI;

  private readonly commandByLabel:
    Map<string, Command> = new Map<string, Command>();

  public constructor(client: Client, discordAPI: DiscordAPI) {
    this.client = client;
    this.discordAPI = discordAPI;
  }

  public async registerCommand(commands: Command[]): Promise<void> {
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
          console.log(`Registered new ${addition} commands to Discord successfully`);
        } else {
          console.log(`Unregistered ${deletion} commands from Discord successfully`);
        }
      }

      commands.forEach((command) => {
        this.commandByLabel.set(command.getInfo().name, command);
      });

      console.log(`Commands: ${commandsName.join(', ')}`);
      console.log(`Registered ${commands.length} commands in-memory successfully`);
    } catch (error) {
      console.error(error);
    }
  }

  public async executeCommand(interaction: CommandInteraction): Promise<void> {
    const command: Command = this.commandByLabel.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
    }
  }

}
