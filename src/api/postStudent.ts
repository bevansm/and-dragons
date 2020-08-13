import { Response, Request } from 'express';
import DataClient from '../db/DataClient';
import { Student } from '../db/DataTypes';

export default async (req: Request, res: Response) => {
  const db = await DataClient.getClient();
  const { body } = req;
  const {
    discord_id,
    pl_id,
    piazza_id,
    course_id = 1,
  } = (body as unknown) as Student;
  if (!discord_id || !pl_id || !piazza_id) {
    res.status(400).send('Missing a required ID parameter.');
  } else {
    try {
      await db.addStudent({ pl_id, course_id, piazza_id, discord_id });
      res.end();
    } catch (e) {
      res.status(500).json(e);
    }
  }
};
