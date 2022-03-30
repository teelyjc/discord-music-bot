# Discord Bot

<p align="center">
  <img src="https://geekflare.com/wp-content/uploads/2021/02/discord-bot-hosting.jpg" height="200px" />
</p>

## Required !
  - Node v.16.14 or higher !
  - Yarn Package Manager.

## How to use ?
  - Installation
    - Clone this repository.
      ```
      git clone https://github.com/teely44y/DiscordBot [folder name]
      ```
    - Install Dependencies.
      ```
      # using yarn
      yarn install
      ```
    - Insert BOT TOKEN in .env
      - Get Token from [Discord Developer.](https://discord.com/developers)
      
      - Rename .env.example to .env
      - Place TOKEN in TOKEN label
        ```
        #EXAMPLE
        TOKEN=BOTTOKEN123123123124124515
        ```
    - create loader file DiscordBotLoader.js or something you want.
      ```
      import MainDiscordBot from '@src/MainDiscordBot';
      import "dotenv/config"

      const { TOKEN } = process.env;
      new MainDiscordBot(TOKEN).startBot();
      ```
    - start bot from your terminal or bash cmd
      ```
      node yourfilename.js
      ```
    
## Available Commands
  - Slash Commands
    - Audio
      - Play : play song.
      - Skip : skip the current song.
      - Queue : list all track and upcoming track.
      - Clear : clear upcoming track from queue.
    - Common
      - Covid : check covid stats.
      - Info : get bot info.
  - Message Commands
    - no commands available now

## Special Thanks
  - [RiflowTH]('https://github.com/riflowth') -> my Boss.
  
  - [Tier-Discord-Bot](https://github.com/riflowth/tier-discord-bot) -> base source.