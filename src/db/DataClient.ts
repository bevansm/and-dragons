import mysql, { Connection, escape } from 'mysql';
import IDataClient, {
  Student,
  Integration,
  CachedScore,
  Score,
  Course,
} from './IDataClient';
import { isUndefined } from 'lodash';

const coursesTable = 'courses';
const studentsTable = 'students';
const scoresTable = 'points';
const scoresCacheTable = 'points_cache';
const integrationsTable = 'integrations';

class DataClient implements IDataClient {
  private static client: DataClient;
  private connection: Connection;

  private async init(
    host: string = process.env.DB_HOST,
    database: string = process.env.DB_DATABASE,
    username: string = process.env.DB_USERNAME,
    password: string = process.env.DB_PASSWORD
  ) {
    this.connection = mysql.createConnection({
      host,
      password,
      user: username,
      database,
    });
  }
  /**
   * Returns a dataclient to the specified MySQL Database.
   * If client hasn't been initialized, and parameters are not provided, uses:
   * DB_HOST
   * DB_USERNAME
   * DB_PASSWORD
   * @param host
   * @param database
   * @param username
   * @param password
   */
  public static async getClient(
    host?: string,
    database?: string,
    username?: string,
    password?: string
  ): Promise<IDataClient> {
    if (!DataClient.client) {
      const client = new DataClient();
      await client.init(host, database, username, password);
      DataClient.client = client;
    }
    return DataClient.client;
  }

  private toFieldsString(obj: object) {
    return `(${Object.keys(obj).join(',')})`;
  }

  private toValuesString(obj: object) {
    return `(${Object.values(obj)
      .map(v => escape(v))
      .join(',')})`;
  }

  private toWhereQuery(obj: object) {
    return Object.entries(obj)
      .map(([key, value]) => `${key} = ${escape(value)}`)
      .join(' AND ');
  }

  private async query<T>(query: string): Promise<T[]> {
    this.connection.connect();
    const res: T[] = await new Promise((resolve, reject) =>
      this.connection.query(query, (error, results) => {
        if (error) reject(error);
        resolve(results);
      })
    );
    this.connection.end();
    return res;
  }

  public async addCourse(course: Omit<Course, 'course_id'>): Promise<Course> {
    const queryStr = `INSERT INTO ${coursesTable} ${this.toFieldsString(
      course
    )} VALUES ${this.toValuesString(course)}`;
    const res = await this.query<Course>(queryStr);
    return res[0];
  }

  private async initScores(studentId: number, table: string) {
    const queryStr = `INSERT INTO ${table} (student_id, integration_id) SELECT ${escape(
      studentId
    )}, integration_id FROM ${integrationsTable}`;
    await this.query<Score>(queryStr);
  }

  public async addStudent(
    student: Omit<Student, 'student_id' | 'last_seen'>
  ): Promise<Student> {
    const queryStr = `INSERT INTO ${studentsTable} ${this.toFieldsString(
      student
    )} VALUES ${this.toValuesString(student)}`;
    const res = await this.query<Student>(queryStr);
    const { student_id } = res[0];
    await this.initScores(student_id, scoresTable);
    await this.initScores(student_id, scoresCacheTable);
    return res[0];
  }

  public async deleteStudent(studentId: number): Promise<Student> {
    const queryStr = `DELETE FROM ${studentsTable} WHERE student_id = ${studentId}`;
    const res = await this.query<Student>(queryStr);
    return res[0];
  }

  public async getStudents(student: Partial<Student>): Promise<Student[]> {
    // TODO:
    throw new Error('Not implemented');
  }

  public async getStudentsByCourse(courseId: number): Promise<Student[]> {
    const queryStr = `SELECT * FROM ${studentsTable} WHERE course_id = ${courseId}`;
    return this.query<Student>(queryStr);
  }

  public async getCachedScoresByStudent(
    studentId: number,
    integration?: Integration
  ): Promise<CachedScore[]> {
    let queryStr = `SELECT * FROM ${scoresCacheTable} WHERE student_id = ${studentId}`;
    if (!isUndefined(integration)) {
      queryStr += ` AND integration_id = ${integration}`;
    }
    return this.query<CachedScore>(queryStr);
  }

  public async getScoresByStudent(
    studentId: number,
    integration?: Integration
  ): Promise<Score[]> {
    let queryStr = `SELECT * FROM ${scoresTable} WHERE student_id = ${studentId}`;
    if (!isUndefined(integration)) {
      queryStr += ` AND integration_id = ${integration}`;
    }
    return this.query<Score>(queryStr);
  }

  public async getCachedScoresByCourse(
    courseId: number,
    integration?: Integration
  ): Promise<CachedScore[]> {
    // TODO:
    throw new Error('Not implemented');
  }

  public async getScoresByCourse(
    courseId: number,
    integration?: Integration
  ): Promise<Score[]> {
    // TODO:
    throw new Error('Not implemented');
  }

  public async updateScore(
    studentId: number,
    integration: Integration,
    points: number
  ): Promise<Score> {
    const queryStr = `UPDATE ${scoresTable} SET points = points + ${points} WHERE integration_id = ${escape(
      integration
    )} AND student_id = ${studentId}`;
    const res = await this.query<Score>(queryStr);
    return res[0];
  }
}

export default DataClient;
