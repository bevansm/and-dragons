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

  private zeropad(str: string, size: number): string {
    while (str.length < size) str = "0" + str;
    return str;
  }

  /**
   * Handles a student's request for a daily.
   */
  private async handleDaily(message: Message) {
    const {
      content,
      channel,
      author: { username },
    } = message;
    // Returns all students with the given discord ID
    const students = await this.db.getStudents({ discord_id: username });

    // pls ignore if i don't know how to ts syntax properly
    let student = students[0];
    if (student === undefined) {
      var student_id = await this.db.addStudent({
        course_id: 1,
        pl_id: "pl_id_placeholder",
        piazza_id: "piazza_id_placeholder",
        discord_id: username
      });
    } else {
      var student_id = student.student_id;
    }
    let row = await (<DataClient> this.db).query(`SELECT * FROM daily WHERE student_id = ${student_id}`);
    let today = new Date();
    let dd = this.zeropad(String(today.getDate()), 2);
    let mm = this.zeropad(String(today.getMonth() + 1), 2);
    let yyyy = String(today.getFullYear());
    let today_string = `${yyyy}-${mm}-${dd}`;
    if (!(row.length)) {
      await (<DataClient> this.db).query(`INSERT INTO daily (last_daily, num_dailies) VALUES ('${today_string}', 1)`);
      channel.send("Daily command used!");
    } else {
      let last_daily = row[1];
      if (last_daily != today_string) {
        await (<DataClient> this.db).query(`UPDATE daily SET num_dailies = num_dailies + 1 WHERE student_id = ${student.student_id}`);
        channel.send("Daily command used!");
      } else {
        channel.send("Daily command is in cooldown.");
      }
    }
  }

  public async start() {
    this.client.on('message', async (message: Message) => {
      const {
        content,
        channel,
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
          return;
          // debugging
          console.log(`Unrecognized string from ${username}: ${contentLower}`);
      }
    });
  }
}

export default DiscordIntegration;
