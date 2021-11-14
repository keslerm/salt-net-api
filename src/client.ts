import axios, { AxiosInstance } from "axios";
import * as salt from "./index";
import EventSource from 'eventsource';

export interface ISaltConfigOptions {
  endpoint: string;
  username: string;
  password: string;
  eauth: string;
}

export abstract class SaltClient {
  protected config: ISaltConfigOptions;

  protected token: string | null = null;
  protected expires: number | null = null;

  protected client: AxiosInstance;

  constructor(config: ISaltConfigOptions) {
    this.config = config;

    this.client = axios.create({
      baseURL: `${this.config.endpoint}`,
    });
  }

  /**
   * Will query the Salt API /jobs/jid endpoint to retrieve job information
   * @typeParam T - The type of the job results
   * @param jid Job to lookup
   * @returns A job
   */
  public async lookupJob<T>(jid: string): Promise<salt.Core.ILookupJobResponse<T>> {
    await this.refreshToken();

    const result = await this.client.get(`/jobs/${jid}`, {
      headers: {
        "X-Auth-Token": this.token,
      }
    });

    return result.data;
  }

  protected async refreshToken() {
    if (!this.expires || this.expires <= new Date().getTime() / 1000) {
      console.log("refreshing token");

      const results = await this.client.post("/login", {
        username: this.config.username,
        password: this.config.password,
        eauth: this.config.eauth,
      });

      if (results.status == 200) {
        console.log("login success");

        this.token = results.data.return[0].token;
        this.expires = results.data.return[0].expire;
      } else {
        throw new Error("Failed to login to SaltStack api");
      }
    }
  }
}
