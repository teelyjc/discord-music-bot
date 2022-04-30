import DiscordInstance from '@src/DiscordInstance';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@src/commands/Command';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';

export default class InviteCommand implements Command {

  private discordInstance: DiscordInstance;

  public constructor(discordInstance: DiscordInstance) {
    this.discordInstance = discordInstance;
  }

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('invite')
      .setDescription('invite me to your server')
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    const client: Client = this.discordInstance.getClient();
    try {
      const inviteEmbed = this.InviteEmbed(client);
      await interaction.editReply({ embeds: [inviteEmbed] });

    } catch (error: any) {
      await interaction.editReply('InviteCommand is unavailable.');
      console.log(`Something went wrong on InviteCommand ${error.message}`);
    }
  }

  private InviteEmbed(client: Client): MessageEmbed {
    return new MessageEmbed()
      .setTitle('Invite me.')
      .setColor('#4c6ce0')
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=3145728&scope=bot%20applications.commands`)
      .addFields(
        {
          name: 'Client Name',
          value: client.user.tag,
          inline: true,
        },
        {
          name: 'Total Guilds',
          value: client.guilds.cache.size.toString(),
          inline: true,
        },
      )
      .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
      .setTimestamp();
  }

}
