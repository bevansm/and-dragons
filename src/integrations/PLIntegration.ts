import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';

class PLIntegration implements IIntegration {
  /**
   * This is our integration ID. It corresponds to a value in the database.
   */
  public integrationId = IntegrationEnum.PL;

  public async init() {
    this.db = await DataClient.getClient();
  }
  /**
   * This sample job prints all courses in the database.
   */
  public async getPLStat() {
    const scores = await db.getCourses();
    console.log(scores);
  }
}

export default PLIntegration;
