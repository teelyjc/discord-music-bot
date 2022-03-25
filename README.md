# Normal Playground 🧑‍💻

<p align="center">
  <img src="https://wallpaperaccess.com/full/3909225.jpg" 
  width="600px"
  />
</p>

## Requirements ⚠️
- Engines 
  - [NodeJS](https://nodejs.org) 16.14.0 (LTS) or higher.
  - [Docker](https://www.docker.com/) A complete container solution.
- Packages
  - [yarn](https://yarnpkg.com/) - A performance package manager.
    - To install, run `npm i -g yarn` on your terminal.
  - [nodemon](https://nodemon.io/) - A development monitor.
    - To install, run `yarn global add nodemon` on your terminal.
- Tool
  - [vscode](https://code.visualstudio.com/) A recommended development tool .

## Start MongoDB by using Docker-Compose

Recommended to use docker-compose to run mongodb.

```
docker-compose --env-file=./.env up -d
```

For production use, just build docker.

```
docker build -t [image name] .
```

## Commands

- to start development with auto-check syntax and build:
```
yarn dev
```

- to build your app for production:
```
yarn build
```

- to start your production app
```
yarn start
```