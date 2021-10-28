import * as Core from "../core";

export interface IInstallRequest extends Core.ILocalRequest {
  kwarg: {
    name: string;
    version?: string;
  }
}

export interface IInstallResponse {
  [key: string]: {
    [key: string]: {
      old: string;
      new: string;
    };
  };
}
