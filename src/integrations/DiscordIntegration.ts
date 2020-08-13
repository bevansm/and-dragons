import IIntegration, { IntegrationEnum } from './IIntegration';
import { Client, Message, User } from 'discord.js';
import IDataClient from '../db/IDataClient';
import DiscordClient from '../clients/DiscordClient';
import DataClient from '../db/DataClient';

enum CommandEnum {
  DAILY = '!daily',
}
class DiscordIntegration implements IIntegration {
  public integrationId = IntegrationEnum.DISCORD;
  private client: Client;
  private db: IDataClient;

  public async init() {
    this.client = await DiscordClient.getClient();
    this.db = await DataClient.getClient();
  }

  /**
   * Handles a student's request for a daily.
   */
  private async handleDaily(message: Message) {
    const {
      content,
      author: { username },
    } = message;
    // Returns all students with the given discord ID
    const students = await this.db.getStudents({ discord_id: username });

    // TODO: do all of this
  }

  public async start() {
    this.client.on('message', async (message: Message) => {
      const {
        content,
        author,
        author: { bot, username },
      } = message;
      if (bot) return;
      const contentLower = content.toLowerCase();
      switch (contentLower) {
        case CommandEnum.DAILY:
          await this.handleDaily(message);
          break;
        default:
          // debugging
          console.log(`Unrecognized string from ${username}: ${contentLower}`);
      }
    });
  }
}

export default DiscordIntegration;
