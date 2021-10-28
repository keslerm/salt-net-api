import * as core from "../modules/core";
import { SaltClient } from "../client";

/**
 * Interact with the Salt API's local client.
 */
export class LocalClient extends SaltClient {
  /**
   * Executes a command against the Salt API's local client
   *
   * @typeParam T - The arguments for the request
   * @typeParam U - The returning type format
   * @param request - The request to execute
   * @returns - Returns the results of the command
   */
  public async exec<T, U>(request: T): Promise<U> {
    await this.refreshToken();

    const command = {
      client: "local",
      ...request,
    };

    console.log(`Request: ${JSON.stringify(command)}`);
    const response = await this.client.post("/", command, {
      headers: {
        "X-Auth-Token": this.token,
      },
    });

    return response.data.return[0];
  }

  /**
   * Executes a command against the Salt API's local_async client
   *
   * @typeParam T - The arguments for the request
   * @param request - The request to execute
   * @returns - Returns the results of the command
   */
  public async execAsync<T>(
    request: T
  ): Promise<core.ILocalAsyncResponse> {
    await this.refreshToken();

    const command = {
      client: "local_async",
      ...request,
    };

    const response = await this.client.post("/", command, {
      headers: {
        "X-Auth-Token": this.token,
      },
    });

    return response.data.return[0];
  }
}
