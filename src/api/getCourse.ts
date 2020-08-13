import { Response, Request } from 'express';
import DataClient from '../db/DataClient';
import { CachedScore, Score, Course } from '../db/DataTypes';

interface GetCourseResponseBody {
  course: Course;
  currentScores: Score[];
  cachedScores: CachedScore[];
}

export default async (req: Request, res: Response) => {
  const db = await DataClient.getClient();
  const {
    query: { course_id = 1 },
  } = req;
  const parsedId = parseInt(course_id as string);
  if (isNaN(parsedId)) res.status(400).send(`Invalid course id: ${course_id}`);
  try {
    const responseBody: GetCourseResponseBody = {
      course: await db.getCourse(parsedId),
      currentScores: await db.getScoresByCourse(parsedId),
      cachedScores: await db.getCachedScoresByCourse(parsedId),
    };
    res.json(responseBody);
  } catch (e) {
    res.status(500).json(e);
  }
};
