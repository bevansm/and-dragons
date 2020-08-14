import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';
import { Course } from '../db/DataTypes';

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
    const gradebook = await this.client.getGradebook(course_id);
  }

  private async runJob() {
    const courses = await this.db.getCourses();
    await Promise.all(courses.map(c => this.processCourse(c)));
  }
}

export default PLIntegration;
