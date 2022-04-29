import MainDiscordBot from '@src/MainDiscordBot';

export default class DiscordBot extends MainDiscordBot {

  protected onReady(): void {
    console.log(`Logged in as ${this.client.user.tag}!`);

    this.commandManager.registerCommand([

    ]);
  }

}
