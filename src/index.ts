import { Client as DiscordClient } from 'discord.js';
import CanvasClient from 'node-canvas-api';
import Piazza from 'piazza-api';

const login = async () => {
  const client = new DiscordClient({
    restRequestTimeout: 600000,
    retryLimit: 10,
  });

  await client.login(process.env.DISCORD_BOT_TOKEN);
  const piazzaClient = await Piazza.login(
    process.env.PIAZZA_USER,
    process.env.PIAZZA_PASS
  );

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
};

login();
