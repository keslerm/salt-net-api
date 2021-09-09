import axios, { AxiosInstance } from "axios";
import * as salt from "./interfaces";

export class SaltClient {
  private config: salt.ISaltConfigOptions;

  private token: string | null = null;
  private expires: number | null = null;

  private client: AxiosInstance;

  constructor(config: salt.ISaltConfigOptions) {
    this.config = config;

    this.client = axios.create({
      baseURL: `${this.config.endpoint}`,
    });
  }

  public async exec(command: salt.ISaltCommandRequest): Promise<any> {
    this.refreshToken();

    const response = await this.client.post("/", command, {
      headers: {
        "X-Auth-Token": this.token,
      },
    });

    response.data;
  }

  protected async refreshToken() {
    if (!this.expires || this.expires <= new Date().getTime()) {
      console.log("refreshing token");

      const results = await this.client.post("/login", {
        username: this.config.username,
        password: this.config.password,
        eauth: this.config.eauth,
      });

      if (results.status == 200) {
        console.log("login success");

        this.token = results.data.return[0].token;
        this.expires = results.data.return[0].expires;
      } else {
        throw new Error("Failed to login to SaltStack api");
      }
    }
  }
}
