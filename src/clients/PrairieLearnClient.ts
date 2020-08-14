import axios from 'axios';
import {
  PrairieLearnAssessment,
  PrairieLearnGradebook,
  PrairieLearnSubmission,
  PrairieLearnAssessmentAccessRule,
} from './PrairieLearnTypes';

export class PrairieLearnClient {
  private static client: PrairieLearnClient;
  private uri: string;
  private token: string;

  constructor(
    uri: string = process.env.PL_API_DOMAIN,
    token: string = process.env.PL_API_TOKEN
  ) {
    this.token = token;
    this.uri = uri;
  }

  private async getForInstance<T>(
    courseInstance: number,
    queryString: string
  ): Promise<T> {
    return axios
      .get(
        `${this.uri}/course_instances/${courseInstance}/${queryString}?private_token=${this.token}`
      )
      .then(res => res.data);
  }

  /**
   * Returns a PrairieLearn client. If uri/token is not provided, uses
   * PL_API_DOMAIN/PL_API_TOKEN to log in.
   * @param courseInstance The course instance that the client should query data from
   * @param uri The base URL that the PrairieLearn API lives at
   * @param token
   */
  public static getClient(uri?: string, token?: string) {
    if (!PrairieLearnClient.client) {
      PrairieLearnClient.client = new PrairieLearnClient(
        uri || process.env.PL_API_DOMAIN,
        token || process.env.PL_API_TOKEN
      );
    }
    return PrairieLearnClient.client;
  }

  // Endpoints & descriptions from https://prairielearn.readthedocs.io/en/latest/api/

  // All assessments in the course instance.
  public async getAssessments(
    courseInstance: number
  ): Promise<PrairieLearnAssessment[]> {
    return this.getForInstance<PrairieLearnAssessment[]>(
      courseInstance,
      'assessments'
    );
  }

  // All of the data available in the course gradebook, with one entry per user containing summary data on all assessments.
  public async getGradebook(
    courseInstance: number
  ): Promise<PrairieLearnGradebook[]> {
    return this.getForInstance<PrairieLearnGradebook[]>(
      courseInstance,
      'gradebook'
    );
  }

  // One specific assessment.
  public async getAssessment(
    courseInstance: number,
    assessmentId: number
  ): Promise<PrairieLearnAssessment> {
    return this.getForInstance<PrairieLearnAssessment>(
      courseInstance,
      `assessments/${assessmentId}`
    );
  }

  // All submissions for a given assessment instance.
  public async getSubmissions(
    courseInstance: number,
    assessmentInstanceId: number
  ): Promise<PrairieLearnSubmission[]> {
    return this.getForInstance<PrairieLearnSubmission[]>(
      courseInstance,
      `assessment_instances/${assessmentInstanceId}/submissions`
    );
  }

  // One specific submission.
  public async getSubmission(
    courseInstance: number,
    submissionId: number
  ): Promise<PrairieLearnSubmission> {
    return this.getForInstance<PrairieLearnSubmission>(
      courseInstance,
      `submissions/${submissionId}`
    );
  }

  public async getAccessRule(
    courseInstance: number,
    assessmentId: number
  ): Promise<PrairieLearnAssessmentAccessRule> {
    return this.getForInstance<PrairieLearnAssessmentAccessRule>(
      courseInstance,
      `/assessments/${assessmentId}/assessment_access_rules`
    );
  }
}

export default PrairieLearnClient;
