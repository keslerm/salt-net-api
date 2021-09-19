import { SaltClient } from "./client";
import * as salt from "../modules/common";
import * as wheel from "../modules/wheel";

export class WheelClient extends SaltClient {
  public async listKeys(
    request: wheel.key.IListKeysRequest
  ): Promise<wheel.key.IListKeysResponse> {
    const response = await this.exec<salt.IGenericResponse>({
      fun: "key.list",
      client: "wheel",
      match: request.match || "all",
    });

    return response.data.return as wheel.key.IListKeysResponse;
  }

  public async acceptKey(
    request: wheel.key.IAcceptKeyRequest
  ): Promise<wheel.key.IAcceptKeyResponse> {
    const response = await this.exec<salt.IGenericResponse>({
      fun: "key.accept",
      client: "wheel",
      match: request.match,
      include_rejected: request.include_rejected,
      include_denied: request.include_denied,
    });

    return response.data.return as wheel.key.IAcceptKeyResponse;
  }
}
