import DiscordInstance from '@src/DiscordInstance';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@src/commands/Command';
import {
  CommandInteraction, MessageEmbed, Client, Guild,
} from 'discord.js';

export default class InfoCommand implements Command {

  private discordInstance: DiscordInstance;

  public constructor(discordInstance: DiscordInstance) {
    this.discordInstance = discordInstance;
  }

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('info')
      .setDescription('send server info')
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    const client: Client = this.discordInstance.getClient();

    const server = await interaction.guild;

    try {
      const infoEmbed = this.InfoEmbed(client, server);
      await interaction.editReply({ embeds: [infoEmbed] });

    } catch (error: any) {
      await interaction.editReply('InfoCommand is unavailable.');
      console.log(`Something went wrong on InfoCommand ${error.message}`);
    }
  }

  private InfoEmbed(client: Client, server: Guild): MessageEmbed {
    return new MessageEmbed()
      .setTitle(`${server.name}'s Info`)
      .setThumbnail(server.bannerURL())
      .setColor('#4c6ce0')
      .addFields(
        {
          name: 'Server Name',
          value: server.name,
          inline: true,
        },
        {
          name: 'Total Members',
          value: `${server.memberCount.toLocaleString()}/${server.maximumMembers.toLocaleString()}`,
          inline: true,
        },
        {
          name: 'Server ID',
          value: server.id,
          inline: false,
        },
      )
      .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
      .setTimestamp();
  }

}
