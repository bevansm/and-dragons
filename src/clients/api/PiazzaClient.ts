import AXIOS, { AxiosInstance, AxiosResponse } from 'axios';
import { CookieJar } from 'tough-cookie';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import qs from 'qs';

export class PiazzaClient {
  private static client: PiazzaClient;
  private jar: CookieJar;
  private axios: AxiosInstance;

  private configureInterceptors() {
    this.axios.interceptors.request.use(req => {
      req.jar = this.jar;
      return req;
    });
  }

  private async request(
    endpoint: string,
    body: { [key: string]: any } = {}
  ): Promise<AxiosResponse> {
    return this.axios.post(
      `https://piazza.com${endpoint}`,
      qs.stringify(body),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000,
      }
    );
  }

  private async login(email: string, password: string) {
    const body = {
      remember: 'on',
      email,
      password,
    };
    await this.request('/class', body);
    return this;
  }

  private constructor() {
    this.jar = new CookieJar();
    this.axios = axiosCookieJarSupport(AXIOS.create());
    this.configureInterceptors();
  }

  /**
   * Returns a PiazzaClient. If email or password are not provided,
   * then the client will use env variables PIAZZA_USER and PIAZZA_PASS
   * to log in.
   * @param email
   * @param password
   */
  public static async getClient(
    email?: string,
    password?: string
  ): Promise<PiazzaClient> {
    if (PiazzaClient.client) return PiazzaClient.client;
    const client = new PiazzaClient();
    await client.login(
      email || process.env.PIAZZA_USER,
      password || process.env.PIAZZA_PASS
    );
    PiazzaClient.client = client;
    return client;
  }
}

export default PiazzaClient;
