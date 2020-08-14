import IIntegration, { IntegrationEnum } from './IIntegration';
import { Client, Message, User } from 'discord.js';
import IDataClient from '../db/IDataClient';
import DiscordClient from '../clients/DiscordClient';
import DataClient from '../db/DataClient';

enum CommandEnum {
  DAILY = '!daily',
  REGISTER = '!register',
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
      author: { id },
    } = message;
    // Returns all students with the given discord ID
    const students = await this.db.getStudents({ discord_id: id });

    // pls ignore if i don't know how to ts syntax properly
    const student = students[0];
    let student_id;
    if (student === undefined) {
      student_id = await this.db.addStudent({
        // this will be necessary to update
        course_id: 1,
        pl_id: "pl_id_placeholder",
        piazza_id: "piazza_id_placeholder",
        discord_id: id
      });
    } else {
      student_id = student.student_id;
    }
    const row = await this.db.query(`SELECT * FROM daily WHERE student_id = ${student_id}`);
    const today = new Date();
    const dd = this.zeropad(String(today.getDate()), 2);
    const mm = this.zeropad(String(today.getMonth() + 1), 2);
    const yyyy = String(today.getFullYear());
    const today_string = `${yyyy}-${mm}-${dd}`;
    if (!(row.length)) {
      await this.db.query(`INSERT INTO daily (student_id, last_daily, num_dailies) VALUES ('${student_id}', '${today_string}', 1)`);
      channel.send("Daily command used!");
    } else {
      const last_daily = row[0].last_daily;
      if (last_daily.toDateString() !== today.toDateString()) {
        await this.db.query(`UPDATE daily SET num_dailies = num_dailies + 1 WHERE student_id = ${student.student_id}`);
        channel.send("Daily command used!");
      } else {
        channel.send("Daily command is in cooldown.");
      }
    }
  }

  /**
   * Allows a student to register in a course, update their data, ect.
   */
  private async handleRegister(message: Message) {
    const {
      content,
      author: { id },
    } = message;
    const [_, rawCourseId, integration, newId] = content
      .toUpperCase()
      .split(' ')
      .map(s => s.trim())
      .filter(s => !!s);
    const courseId = parseInt(rawCourseId);

    console.log(content);
    let reply = '';
    if (isNaN(courseId)) {
      reply = 'Invalid course ID.';
    } else if (
      !(integration in IntegrationEnum) ||
      integration === IntegrationEnum.DISCORD
    ) {
      reply = 'Invalid integration.';
    } else if (!newId) {
      reply = 'Invalid ID.';
    } else {
      try {
        const course = await this.db.getCourse(courseId);
        const [student] = await this.db.getStudents({ discord_id: id });
        let studentId;
        if (!student) {
          studentId = await this.db.addStudent({
            course_id: courseId,
            pl_id: '',
            discord_id: `${id}`,
            piazza_id: '',
          });
        } else {
          studentId = student.student_id;
        }
        await this.db.updateStudent(
          studentId,
          integration as IntegrationEnum,
          newId
        );
        reply = 'Registration successful!';
      } catch (e) {
        reply =
          "Unable to update. Does the course you're trying to join exist?";
      }
    }
    message.reply(reply);
  }

  public async start() {
    this.client.on('message', async (message: Message) => {
      const {
        content,
        channel,
        author,
        author: { bot, id },
      } = message;
      if (bot) return;
      const contentLower = content.toLowerCase();
      const arg = contentLower.split(' ')[0].trim();
      switch (arg) {
        case CommandEnum.DAILY:
          await this.handleDaily(message);
          break;
        case CommandEnum.REGISTER:
          await this.handleRegister(message);
          break;
        default:
          return;
          // debugging
          console.log(`Unrecognized string from ${id}: ${contentLower}`);
      }
    });
  }
}

export default DiscordIntegration;
