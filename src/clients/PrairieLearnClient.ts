import axios from 'axios';
import {
  PrairieLearnAssessment,
  PrairieLearnGradebook,
  PrairieLearnSubmission,
} from './PrairieLearnTypes';

export class PrairieLearnClient {
  private static client: PrairieLearnClient;
  private courseInstance: number;
  private uri: string;
  private token: string;

  constructor(courseInstance: number, uri: string, token: string) {
    this.courseInstance = courseInstance;
    this.token = token;
    this.uri = uri;
  }

  private async getForInstance<T>(queryString: string): Promise<T> {
    return axios.get(
      `${this.uri}/course_instances/${this.courseInstance}/${queryString}?private_token=${this.token}`
    );
  }

  /**
   * Returns a PrairieLearn client. If uri/token is not provided, uses
   * PL_API_DOMAIN/PL_API_TOKEN to log in.
   * @param courseInstance The course instance that the client should query data from
   * @param uri The base URL that the PrairieLearn API lives at
   * @param token
   */
  public static getClient(
    courseInstance: number,
    uri?: string,
    token?: string
  ) {
    if (!PrairieLearnClient.client) {
      PrairieLearnClient.client = new PrairieLearnClient(
        courseInstance,
        uri || process.env.PL_API_DOMAIN,
        token || process.env.PL_API_TOKEN
      );
    }
    return PrairieLearnClient.client;
  }

  // Endpoints & descriptions from https://prairielearn.readthedocs.io/en/latest/api/

  // All assessments in the course instance.
  public async getAssessments(): Promise<PrairieLearnAssessment[]> {
    return this.getForInstance<PrairieLearnAssessment[]>('assessments');
  }

  // All of the data available in the course gradebook, with one entry per user containing summary data on all assessments.
  public async getGradebook(): Promise<PrairieLearnGradebook> {
    return this.getForInstance<PrairieLearnGradebook>('gradebook');
  }

  // One specific assessment.
  public async getAssessment(
    assessmentId: number
  ): Promise<PrairieLearnAssessment> {
    return this.getForInstance<PrairieLearnAssessment>(
      `assessments/${assessmentId}`
    );
  }

  // All submissions for a given assessment instance.
  public async getSubmissions(
    assessmentInstanceId: number
  ): Promise<PrairieLearnSubmission[]> {
    return this.getForInstance<PrairieLearnSubmission[]>(
      `assessment_instances/${assessmentInstanceId}/submissions`
    );
  }

  // One specific submission.
  public async getSubmission(
    submissionId: number
  ): Promise<PrairieLearnSubmission> {
    return this.getForInstance<PrairieLearnSubmission>(
      `submissions/${submissionId}`
    );
  }
}

export default PrairieLearnClient;
