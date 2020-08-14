import IIntegration, { IntegrationEnum } from './IIntegration';
import IDataClient from '../db/IDataClient';
import PLClient from '../clients/PrairieLearnClient';
import DataClient from '../db/DataClient';

class PLIntegration implements IIntegration {
  /**
   * This is our integration ID. It corresponds to a value in the database.
   */
  public integrationId = IntegrationEnum.PL;
  private db: IDataClient;

  public async init() {
    this.db = await DataClient.getClient();
  }

  public async start(){
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
