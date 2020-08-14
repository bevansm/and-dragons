import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';

class PLIntegration implements IIntegration {
  private db: IDataClient;
  private client: PLClient;

  /**
   * This is our integration ID. It corresponds to a value in the database.
   */
  public integrationId = IntegrationEnum.PL;

  public async init() {
    this.db = await DataClient.getClient();
    this.client = await PLClient.getClient(0);
  }

  /**
   * This sample job prints all courses in the database.
   */
  public async start() {
    const scores = await this.db.getCourses();
    console.log(scores);
  }
}

export default PLIntegration;
