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
        author,
        author: { bot, username },
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
          // debugging
          console.log(`Unrecognized string from ${username}: ${contentLower}`);
      }
    });
  }
}

export default DiscordIntegration;
