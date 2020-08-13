import express, { Request, Response } from 'express';
import DiscordIntegration from './integrations/DiscordIntegration';

const app = express();

const start = async () => {
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
  const discordIntegration = new DiscordIntegration();
  await discordIntegration.init();
  discordIntegration.start();
};

app.get('/health', (_req: Request, res: Response) => res.send('OK'));

app.listen(8080);
console.log('App listening at http://localhost:8080');

start().catch(e => console.log(e));
