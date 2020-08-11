import DBClient from '../src/db/DataClient';
import { Student } from '../src/db/IDataClient';

const populateDb = async () => {
  const client = await DBClient.getClient();
  const course_id = await client.addCourse({ pl_course_id: 0 });
  const submitStudent: Omit<Student, 'last_seen' | 'student_id'> = {
    course_id,
    discord_id: 'test#1234',
    piazza_id: 'test@test.com',
    pl_id: 'test@pl.com',
  };
  // @ts-ignore
  const student_id = await client.addStudent(submitStudent);
  const students = await client.getStudents(submitStudent);
  console.log(students);
};

populateDb();
