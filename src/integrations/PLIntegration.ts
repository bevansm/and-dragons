import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';
import { Course } from '../db/DataTypes';
import { PrairieLearnAssessmentAccessRule } from 'src/clients/PrairieLearnTypes';
import { PrairieLearnAssessmentAccessRule } from 'src/clients/PrairieLearnTypes';

class PLIntegration implements IIntegration {
  private db: IDataClient;
  private client: PLClient;
  public integrationId = IntegrationEnum.PL;

  public async init() {
    this.db = await DataClient.getClient();
    this.client = await PLClient.getClient(0);
  }

  public async start() {
    console.log('Start OK');
    setTimeout(this.start, 1000 * 60 * 60);
  }

  private async processCourse(course: Course) {
    const { course_id, pl_last_checked } = course;
    const assessments = await this.client.getAssessments(course_id);
    const accessRules: PrairieLearnAssessmentAccessRule[] = await Promise.all(
      assessments.map(({ assessment_id }) =>
        this.client.getAccessRule(course_id, assessment_id)
      )
    );
  }

  private async runJob() {
    const courses = await this.db.getCourses();
    await Promise.all(courses.map(c => this.processCourse(c)));
  }
}

export default PLIntegration;
