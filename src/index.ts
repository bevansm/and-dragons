import express, { Request, Response } from 'express';
import PiazzaClient from './clients/PiazzaClient';
import DiscordClient from './clients/DiscordClient';
import CanvasClient from 'node-canvas-api';

const app = express();

const login = async () => {
  const piazzaClient = await PiazzaClient.getClient();
  const discordClient = await DiscordClient.getClient();
  console.log('Logged in!');
};

app.get('/health', (_req: Request, res: Response) => res.send('OK'));

app.listen(8080);
console.log('App listening at http://localhost:8080');

login().catch(e => console.log(e));
