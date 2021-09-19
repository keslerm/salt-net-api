import { SaltClient } from "./client";
import * as salt from "../interfaces";

export class WheelClient extends SaltClient {
  public async listKeys(
    request: salt.IListKeysRequest
  ): Promise<salt.IListKeysResponse> {
    const response = await this.exec<salt.IGenericResponse>({
      fun: "key.list",
      client: "wheel",
      match: request.match || "all",
    });

    return response.data.return as salt.IListKeysResponse;
  }

  public async acceptKey(
    request: salt.IAcceptKeyRequest
  ): Promise<salt.IAcceptKeyResponse> {
    const response = await this.exec<salt.IGenericResponse>({
      fun: "key.accept",
      client: "wheel",
      match: request.match,
      include_rejected: request.include_rejected,
      include_denied: request.include_denied,
    });

    return response.data.return as salt.IAcceptKeyResponse;
  }
}
