import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';

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
  }
  /**
   * This sample job prints all courses in the database.
   */
  public async getPLStat() {
    console.log('Start PL Stat');
    // const scores = await this.db.getCourses();

    // console.log(scores);
  }
}

export default PLIntegration;
