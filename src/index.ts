import express, { Request, Response } from 'express';
import PiazzaClient from './clients/PiazzaClient';
import DiscordClient from './clients/api/DiscordClient';
import CanvasClient from 'node-canvas-api';
import PrairieLearnClient from './clients/PrairieLearnClient';

const app = express();

const login = async () => {
  /**
   * These are our main clients for accessing various APIs.
   * - The piazza client does not have many methods.
   *    We will have to put it together as we go.
   *
   * - The discord client is meant to run a discord bot.
   *    We will likely have to look into the docs more for rich prescence support.
   *
   * - The prairielearn client is more or less complete.
   *    It only has get methods. We cannot manipulate the data in PL.
   *
   * - The canvas client has most of the methods from the canvas api, but we may have to type them.
   *    Look in ./types/node-canvas-api for more details.
   */
  const piazzaClient = await PiazzaClient.getClient();
  const discordClient = await DiscordClient.getClient();
  const prairieLearnClient = PrairieLearnClient.getClient(0);
  const canvasClient = CanvasClient;

  console.log('Logged in!');
};

app.get('/health', (_req: Request, res: Response) => res.send('OK'));

app.listen(8080);
console.log('App listening at http://localhost:8080');

login().catch(e => console.log(e));
