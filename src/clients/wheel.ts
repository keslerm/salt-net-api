import { SaltClient } from "../salt-client";
import * as salt from "../interfaces";

export class WheelClient extends SaltClient {
  public async listKeys(
    request: salt.IListKeysRequest
  ): Promise<salt.IListKeysResponse> {
    await this.refreshToken();

    const response = await this.exec({
      fun: "key.list",
      client: "wheel",
      match: request.match || "all",
    });

    return response.return[0].data.return as salt.IListKeysResponse;
  }

  public async acceptKey(
    request: salt.IAcceptKeyRequest
  ): Promise<salt.IAcceptKeyResponse> {
    await this.refreshToken();

    const response = await this.exec({
      fun: "key.accept",
      client: "wheel",
      match: request.match,
      include_rejected: request.include_rejected,
      include_denied: request.include_denied,
    });

    return response.return[0].data.return as salt.IAcceptKeyResponse;
  }

}