import { SaltClient } from "../salt-client";
import * as salt from "../interfaces"

export class LocalClient extends SaltClient {
  public async testPing(
    request: salt.ITestPingRequest
  ): Promise<salt.ITestPingResult> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "test.ping",
      tgt: request.tgt,
    });

    return response.return[0] as salt.ITestPingResult;
  }

  public async stateHighState(
    request: salt.IStateHighStateRequest
  ): Promise<salt.IStateHighStateResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "state.highstate",
      tgt: request.tgt,
    });

    return response.return[0] as salt.IStateHighStateResponse;
  }

  public async grainsSet(request: salt.IGrainsSetRequest): Promise<salt.IGrainsSetResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "grains.set",
      tgt: request.tgt,
      arg: request.arg,
    });

    return response.return[0] as salt.IGrainsSetResponse;
  }
}
