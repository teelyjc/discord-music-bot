/* eslint-disable camelcase */
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@src/commands/command.common';
import process from 'process';

export default class Info implements Command {

  private client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('info')
      .setDescription('to get discord bot info. 🤖')
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    try {
      const repleMessage = this.getReplyEmbed();
      interaction.editReply({ embeds: [repleMessage] });

    } catch (error) {
      interaction.editReply('Somethings went wrong, please try again later. ❌');
      console.log(error.message);
    }
  }

  private getReplyEmbed(): MessageEmbed {
    const { npm_package_version } = process.env;
    const uptime = process.uptime() / 60;

    return new MessageEmbed()
      .setColor('#0086cf')
      .setTitle(`${this.client.user.tag} Info. 🤖`)
      .addFields(
        {
          name: 'version :',
          value: `${npm_package_version}`,
          inline: true,
        },
        {
          name: 'uptime :',
          value: `${uptime.toFixed(1)} minutes.`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: this.client.user.username });
  }

}
