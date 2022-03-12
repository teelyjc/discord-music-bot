import { CommandInteraction } from 'discord.js';

export default class Reply {

  public static delete(interaction: CommandInteraction, delay: number): void {
    setTimeout(() => {
      interaction.deleteReply();
    }, delay * 60 * 1000);
  }

}
