import mysql, { Connection, escape, ConnectionConfig } from 'mysql';
import IDataClient from './IDataClient';
import {
  Student,
  CachedScore,
  Score,
  Course
} from "./DataTypes";
import { isUndefined } from 'lodash';
import { IntegrationEnum } from '../integrations/IIntegration';

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
    const config: ConnectionConfig = {
      multipleStatements: true,
      insecureAuth: true,
      host,
      password,
      user: username,
      database,
    };
    console.log(config);
    this.connection = mysql.createConnection(config);
    this.connection.connect();
  }
  /**
   * Returns a dataclient to the specified MySQL Database.
   * Uses DB_* env variables as outlined in .env
   */
  public static async getClient(): Promise<IDataClient> {
    if (!DataClient.client) {
      const client = new DataClient();
      await client.init();
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

  private async query(query: string): Promise<any> {
    const res = await new Promise((resolve, reject) =>
      this.connection.query(query, (error, results) => {
        if (error) reject(error);
        resolve(results);
      })
    );
    return res;
  }

  public async addCourse(course: Omit<Course, 'course_id'>): Promise<number> {
    const queryStr = `INSERT INTO ${coursesTable} ${this.toFieldsString(
      course
    )} VALUES ${this.toValuesString(course)}`;
    const res = await this.query(queryStr);
    return res.insertId;
  }

  public async getCourse(courseId: number): Promise<Course> {
    const queryStr = `SELECT * FROM ${coursesTable} WHERE course_id = ${courseId}`;
    const res = await this.query(queryStr);
    if (!res.length) throw new Error('No courses found with the given ID.');
    return res[0];
  }

  public async getCourses(): Promise<Course[]> {
    const queryStr = `SELECT * FROM ${coursesTable}`;
    const res = await this.query(queryStr);
    return res;
  }

  private async initScores(studentId: number, table: string) {
    const queryStr = `INSERT INTO ${table} (student_id, integration_id) SELECT ${escape(
      studentId
    )}, integration_id FROM ${integrationsTable}`;
    await this.query(queryStr);
  }

  public destroy() {
    this.connection.end();
  }

  public async addStudent(
    student: Omit<Student, 'student_id' | 'last_seen'>
  ): Promise<number> {
    const queryStr = `INSERT INTO ${studentsTable} ${this.toFieldsString(
      student
    )} VALUES ${this.toValuesString(student)}`;
    const res = await this.query(queryStr);
    const { insertId } = res;
    await this.initScores(insertId, scoresTable);
    await this.initScores(insertId, scoresCacheTable);
    return insertId;
  }

  public async deleteStudent(studentId: number): Promise<void> {
    const queryStr = `DELETE FROM ${studentsTable} WHERE student_id = ${studentId}`;
    await this.query(queryStr);
  }

  public async getStudents(student: Partial<Student>): Promise<Student[]> {
    const queryStr = `SELECT * FROM ${studentsTable} WHERE ${this.toWhereQuery(
      student
    )}`;
    return this.query(queryStr);
  }

  public async getStudentsByCourse(courseId: number): Promise<Student[]> {
    const queryStr = `SELECT * FROM ${studentsTable} WHERE course_id = ${courseId}`;
    return this.query(queryStr);
  }

  public async getCachedScoresByStudent(
    studentId: number,
    integration?: IntegrationEnum
  ): Promise<CachedScore[]> {
    let queryStr = `SELECT * FROM ${scoresCacheTable} WHERE student_id = ${studentId}`;
    if (!isUndefined(integration)) {
      queryStr += ` AND integration_id = ${integration}`;
    }
    return this.query(queryStr);
  }

  public async getScoresByStudent(
    studentId: number,
    integration?: IntegrationEnum
  ): Promise<Score[]> {
    let queryStr = `SELECT * FROM ${scoresTable} WHERE student_id = ${studentId}`;
    if (!isUndefined(integration)) {
      queryStr += ` AND integration_id = ${integration}`;
    }
    return this.query(queryStr);
  }

  private async queryScoresByCourse<T>(
    table: string,
    courseId: number,
    integration?: IntegrationEnum
  ): Promise<T[]> {
    let queryStr = `SELECT * FROM ${table} sc 
                      LEFT JOIN ${studentsTable} s ON sc.student_id = s.student_id
                      WHERE s.course_id = ${courseId}`;
    if (!isUndefined(integration)) {
      queryStr += ` AND integration_id = ${integration}`;
    }
    return this.query(queryStr);
  }

  public async getCachedScoresByCourse(
    courseId: number,
    integration?: IntegrationEnum
  ): Promise<CachedScore[]> {
    return this.queryScoresByCourse<CachedScore>(
      scoresCacheTable,
      courseId,
      integration
    );
  }

  public async getScoresByCourse(
    courseId: number,
    integration?: IntegrationEnum
  ): Promise<Score[]> {
    return this.queryScoresByCourse<CachedScore>(
      scoresTable,
      courseId,
      integration
    );
  }

  public async updateScore(
    studentId: number,
    integration: IntegrationEnum,
    points: number
  ): Promise<number> {
    const queryStr = `UPDATE ${scoresTable} SET points = @points := points + ${points} WHERE integration_id = ${escape(
      integration
    )} AND student_id = ${studentId}; SELECT @points;`;
    const res = await this.query(queryStr);
    return res[1][0]['@points'];
  }
}

export default DataClient;
