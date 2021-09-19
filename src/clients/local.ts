import { SaltClient } from "./client";
import * as salt from "../interfaces"

export class LocalClient extends SaltClient {
  // Pkg
  public async pkgInstall(
    request: salt.IPkgInstallRequest
  ): Promise<salt.IPkgInstallResponse> {
    const results = await this.exec<salt.IPkgInstallResponse>({
      client: "local",
      fun: "pkg.install",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
        version: request.version,
      }
    });

    return results;
  }

  // Test
  public async testPing(
    request: salt.ITestPingRequest
  ): Promise<salt.ITestPingResponse> {
    const response = await this.exec<salt.ITestPingResponse>({
      client: "local",
      fun: "test.ping",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
    });

    return response;
  }

  // State
  public async stateHighState(
    request: salt.IStateHighStateRequest
  ): Promise<salt.IStateHighStateResponse> {
    const response = await this.exec<salt.IStateHighStateResponse>({
      client: "local",
      fun: "state.highstate",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
    });

    return response;
  }

  // Grains
  public async grainsSet(request: salt.IGrainsSetRequest): Promise<salt.IGrainsSetResponse> {
    const response = await this.exec<salt.IGrainsSetResponse>({
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

    return response;
  }

  public async serviceRestart(request: salt.IServiceRestartRequest): Promise<salt.IServiceRestartResponse> {
    const response = await this.exec<salt.IGenericResponse>({
      client: "local",
      fun: "service.restart",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
      },
    });

    // Opinion: this should return a better result
    const formatted: salt.IServiceRestartResponse = {};

    for (const target of Object.keys(response)) {
      if (typeof response[target] === "boolean") {
        formatted[target] = {
          result: (response[target] as any),
        }
      } else {
        formatted[target] = {
          result: false,
          message: (response[target] as any),
        }
      }
    }

    return formatted;
  }

  public async serviceStatus(request: salt.IServiceRestartRequest): Promise<salt.IServiceStatusResponse> {
    const response = await this.exec<salt.IServiceStatusResponse>({
      client: "local",
      fun: "service.status",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
      },
    });

    return response;
  }
}
