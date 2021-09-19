import { ISaltTargets } from "../common";

export interface IPkgInstallRequest extends ISaltTargets {
  name: string;
  version?: string;
}
export interface IPkgInstallResponse {
  [key: string]: {
    [key: string]: {
      old: string;
      new: string;
    };
  };
}