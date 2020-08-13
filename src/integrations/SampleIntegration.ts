import IIntegration, { IntegrationEnum } from './IIntegration';
import DataClient from '../db/DataClient';

class SampleIntegration implements IIntegration {
  /**
   * This is our integration ID. It corresponds to a value in the database.
   */
  public integrationId = IntegrationEnum.DISCORD;

  public async init(): Promise<void> {
    return null;
  }
  /**
   * This sample job prints all courses in the database.
   */
  public async start() {
    const db = await DataClient.getClient();
    const scores = await db.getCourses();
    console.log(scores);
  }
}

export default SampleIntegration;
