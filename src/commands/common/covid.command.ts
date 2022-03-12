import Command, { CommandInfo } from '@src/commands/command.common';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import axios from 'axios';
import moment from 'moment';
import Reply from '@src/commands/delete.interaction';

export default class Covid implements Command {

  private client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('covid')
      .setDescription('covid daily report 💊')
      .addStringOption((option) => option
        .setName('country')
        .setDescription('type country')
        .setRequired(false))
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    const country = interaction.options.getString('country') || 'Thailand';
    const covidUrl = `https://disease.sh/v3/covid-19/countries/${country}`;

    try {
      await interaction.deferReply();
      const { data } = await axios.get(covidUrl);

      const replyMessage = this.getReplyEmbed(data);
      interaction.editReply({ embeds: [replyMessage] });

      Reply.delete(interaction, 3);

    } catch (error) {
      interaction.editReply('Somethings went wrong, please try again later. ❌');
      Reply.delete(interaction, 1);
      console.log(error.message);
    }
  }

  private getReplyEmbed(data: any): MessageEmbed {
    return new MessageEmbed()
      .setColor('#0086cf')
      .setTitle(`Covid report for ${moment().format('LL')} \nCountry: ${data.country}`)
      .setThumbnail(data.countryInfo.flag)
      .addFields(
        {
          name: 'Cases 🤒',
          value: `${data.cases.toLocaleString()} (+${data.todayCases.toLocaleString()})`,
          inline: false,
        },
        {
          name: 'Deaths ☠',
          value: `${data.deaths.toLocaleString()} (+${data.todayDeaths.toLocaleString()})`,
          inline: false,
        },
        {
          name: 'Recovered 💉',
          value: `${data.recovered.toLocaleString()} (+${data.todayRecovered.toLocaleString()})`,
          inline: false,
        },
        {
          name: 'Active 👨🏻‍⚕️',
          value: `${data.active.toLocaleString()}`,
          inline: false,
        },
      )
      .setTimestamp()
      .setFooter({ text: this.client.user.username });
  }

}
