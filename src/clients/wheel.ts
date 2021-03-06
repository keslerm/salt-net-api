import { SaltClient } from "../client";

export class WheelClient extends SaltClient {
  public async exec<T, U>(request: T): Promise<U> {
    await this.refreshToken();

    const command = {
      client: "wheel",
      ...request,
    };

    const response = await this.client.post("/", command, {
      headers: {
        "X-Auth-Token": this.token,
      },
    });

    return response.data.return[0].data.return;
  }
}
