/**
 * An integration is a link with another platform.
 * Using a new integration should be as easy as writing:
 *
 *      const myIntegration = new MyIntegration();
 *      myIntegration.start();
 *
 * Every integration should:
 *  - Quantify student engagement
 *  - Convert this "quantification" to points
 *  - Using the student ID from that platform, query the "and-dragons" ID from the database
 *  - Gracefully handle/ignore the student if they do not exist in the database
 *  - Else, update a student's points for that integration in the database
 *
 * Every integration should use/have:
 *  - An integration code in the database. This should corresond to a field on "IntegrationEnum"
 *  - An API wrapper if calling out to an external service. Most of these should live in ../clients
 *
 * Every integration should avoid:
 *  - Statefulness. Any state (i.e. data) should be persisted in the database.
 *      If you need to add more fields to the databse to manage this, feel free to update the schema as needbe. :)
 *      Our table schema is all in ./sql/tables.sql, and each table/object has a corresponding interface in ./src/db/DataTypes.ts
 *
 * If an integration has to run a cron job (i.e. we have to run it every day, ect.),
 *  look into using the "cron" library (https://www.npmjs.com/package/cron). It's already been added to this repo.
 */

export enum IntegrationEnum {
  PL = 'PL',
  DISCORD = 'DISCORD',
  PIAZZA = 'PIAZZA',
}

export interface IIntegration {
  integrationId: IntegrationEnum;

  /**
   * Starts the integration.
   */
  start: () => Promise<void>;
}

export default IIntegration;
