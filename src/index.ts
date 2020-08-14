import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import PiazzaClient from './clients/PiazzaClient';
import DiscordClient from './clients/DiscordClient';
import CanvasClient from 'node-canvas-api';
import PrairieLearnClient from './clients/PrairieLearnClient';
import PrairieLearnIntegration from './integrations/PLIntegration';
import DiscordIntegration from './integrations/DiscordIntegration';
import DataClient from './db/DataClient';
import { Student } from './db/DataTypes';
import postStudent from './api/postStudent';
import getStudent from './api/getStudent';
import getCourse from './api/getCourse';

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
  // const discordIntegration = new DiscordIntegration();
  // await discordIntegration.init();
  // discordIntegration.start();

  const PLIntegration = new PrairieLearnIntegration();
  await PLIntegration.init();
  console.log('start 3');
  // PLIntegration.start();
  await PLIntegration.start();
  await PLIntegration.getPLStat();
  // console.log(PLIntegration);
};

app.use(bodyParser.json());
app.get('/health', (_req: Request, res: Response) => res.send('OK'));
app.get('/course', getCourse);
app.get('/student', getStudent);
app.post('/student', postStudent);

app.listen(8080);
console.log('App listening at http://localhost:8080');

start().catch(e => console.log(e));
