import { Response, Request } from 'express';
import DataClient from '../db/DataClient';
import { Student, CachedScore, Score } from '../db/DataTypes';
import { parse } from 'qs';

interface GetStudentResponseBody {
  student: Student;
  currentScores: Score[];
  cachedScores: CachedScore[];
}

export default async (req: Request, res: Response) => {
  const db = await DataClient.getClient();
  const {
    query: { student_id },
  } = req;

  if (!student_id) {
    res.status(400).send('Missing student_id.');
  } else {
    const parsedId = parseInt(student_id as string);
    if (isNaN(parsedId))
      res.status(400).send(`Invalid student id: ${student_id}`);
    try {
      const students = await db.getStudents({ student_id: parsedId });
      const responseBody: GetStudentResponseBody = {
        student: students[0],
        currentScores: await db.getScoresByStudent(parsedId),
        cachedScores: await db.getCachedScoresByStudent(parsedId),
      };
      res.json(responseBody);
    } catch (e) {
      res.status(500).json(e);
    }
  }
};
