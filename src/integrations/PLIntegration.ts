import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';
import { Course } from '../db/DataTypes';
import { PrairieLearnGradebook } from '../clients/PrairieLearnTypes';

class PLIntegration implements IIntegration {
  private db: IDataClient;
  private client: PLClient;
  public integrationId = IntegrationEnum.PL;

  public async init() {
    this.db = await DataClient.getClient();
    this.client = await PLClient.getClient();
  }

  public async start() {
    await this.runJob();
    setTimeout(this.start, 1000 * 60 * 60);
  }

  private async handleStudentGradebook(
    courseId: number,
    gradebook: PrairieLearnGradebook
  ) {
    const { user_uid, assessments } = gradebook;
    const [student] = await this.db.getStudents({
      course_id: courseId,
      pl_id: `${user_uid}`,
    });
    if (!student) console.log(`No corresponding user for ${user_uid}`);
    const score = assessments.reduce(
      (acc: number, { points = 0 }: any) => acc + points,
      0
    );
    const newScore = await this.db.updateScore(
      student.student_id,
      this.integrationId,
      score
    );
  }

  private async handleCourse(course: Course) {
    const { course_id, pl_course_id } = course;
    const studentsGradebooks = await this.client.getGradebook(pl_course_id);
    console.log(studentsGradebooks);
    await this.db.updateCourseLastPL(course_id, new Date());
    await Promise.all(
      studentsGradebooks.map(sg => this.handleStudentGradebook(course_id, sg))
    );
  }

  private async runJob() {
    const courses = await this.db.getCourses();
    console.log(courses);
    const anHourAgo = Date.now() - 1000 * 60 * 60;
    await Promise.all(
      courses
        .filter(
          ({ pl_last_checked }) =>
            !pl_last_checked || Date.parse(pl_last_checked) < anHourAgo
        )
        .map(c => this.handleCourse(c))
    );
  }
}

export default PLIntegration;
