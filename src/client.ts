import axios, { AxiosInstance } from "axios";
import * as salt from "./modules/core";

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
