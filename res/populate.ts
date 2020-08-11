import DBClient from '../src/db/DataClient';
import { Student, Integration } from '../src/db/IDataClient';

const populateDb = async () => {
  const client = await DBClient.getClient();
  try {
    const course_id = await client.addCourse({ pl_course_id: 0 });
    const submitStudent: Omit<Student, 'last_seen' | 'student_id'> = {
      course_id,
      discord_id: 'test#1234',
      piazza_id: 'test@test.com',
      pl_id: 'test@pl.com',
    };
    // @ts-ignore
    const student_id = await client.addStudent(submitStudent);
    console.log(await client.getStudents(submitStudent));
    console.log(
      await client.getStudents({
        discord_id: 'test#1234',
        piazza_id: 'test@test.com',
        pl_id: 'test@pl.com',
      })
    );
    console.log('in course', await client.getStudentsByCourse(course_id));
    console.log(
      'scores from course',
      await client.getScoresByCourse(course_id)
    );
    console.log(await client.updateScore(student_id, Integration.DISCORD, 1));
  } catch (e) {
    throw e;
  } finally {
    client.destroy();
  }
};

populateDb();
