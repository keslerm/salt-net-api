import { SaltClient } from "./client";
import * as local from "../modules/local";
import * as common from "../modules/common";

export class LocalClient extends SaltClient {
  // Pkg
  public async pkgInstall(
    request: local.pkg.IPkgInstallRequest
  ): Promise<local.pkg.IPkgInstallResponse> {
    const results = await this.exec<local.pkg.IPkgInstallResponse>({
      client: "local",
      fun: "pkg.install",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
        version: request.version,
      },
    });

    return results;
  }

  // Test
  public async testPing(
    request: local.test.ITestPingRequest
  ): Promise<local.test.ITestPingResponse> {
    const response = await this.exec<local.test.ITestPingResponse>({
      client: "local",
      fun: "test.ping",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
    });

    return response;
  }

  // State
  public async stateHighState(
    request: local.state.IStateHighStateRequest
  ): Promise<local.state.IStateHighStateResponse> {
    const response = await this.exec<local.state.IStateHighStateResponse>({
      client: "local",
      fun: "state.highstate",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
    });

    return response;
  }

  // Grains
  public async grainsSet(
    request: local.grains.IGrainsSetRequest
  ): Promise<local.grains.IGrainsSetResponse> {
    const response = await this.exec<local.grains.IGrainsSetResponse>({
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

  public async serviceRestart(
    request: local.service.IServiceRestartRequest
  ): Promise<local.service.IServiceRestartResponse> {
    const response = await this.exec<common.IGenericResponse>({
      client: "local",
      fun: "service.restart",
      tgt: request.tgt,
      tgt_type: request.tgt_type,
      kwarg: {
        name: request.name,
      },
    });

    // Opinion: this should return a better result
    const formatted: local.service.IServiceRestartResponse = {};

    for (const target of Object.keys(response)) {
      if (typeof response[target] === "boolean") {
        formatted[target] = {
          result: response[target] as any,
        };
      } else {
        formatted[target] = {
          result: false,
          message: response[target] as any,
        };
      }
    }

    return formatted;
  }

  public async serviceStatus(
    request: local.service.IServiceRestartRequest
  ): Promise<local.service.IServiceStatusResponse> {
    const response = await this.exec<local.service.IServiceStatusResponse>({
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
