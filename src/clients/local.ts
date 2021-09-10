import { SaltClient } from "../salt-client";
import * as salt from "../interfaces"

export class LocalClient extends SaltClient {
  public async testPing(
    request: salt.ITestPingRequest
  ): Promise<salt.ITestPingResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "test.ping",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
    });

    return response.return[0] as salt.ITestPingResponse;
  }

  public async stateHighState(
    request: salt.IStateHighStateRequest
  ): Promise<salt.IStateHighStateResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "state.highstate",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
    });

    return response.return[0] as salt.IStateHighStateResponse;
  }

  public async grainsSet(request: salt.IGrainsSetRequest): Promise<salt.IGrainsSetResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "grains.set",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        key: request.key,
        val: request.value,
        force: request.force,
        destructive: request.destructive,
        delimiter: request.delimiter,
      },
    });

    return response.return[0] as salt.IGrainsSetResponse;
  }

  public async serviceRestart(request: salt.IServiceRestartRequest): Promise<salt.IServiceRestartResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "service.restart",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
      },
    });

    return response.return[0] as salt.IServiceRestartResponse;
  }

  public async serviceStatus(request: salt.IServiceRestartRequest): Promise<salt.IServiceRestartResponse> {
    await this.refreshToken();

    const response = await this.exec({
      client: "local",
      fun: "service.status",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
      },
    });

    return response.return[0] as salt.IServiceRestartResponse;
  }
}
