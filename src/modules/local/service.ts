import { ISaltTargets, IGenericBooleanResponse } from "../common";

export interface IServiceRestartRequest extends ISaltTargets {
  name: string;
}
export interface IServiceRestartResponse {
  [key: string]: {
    result: boolean;
    message?: string;
  };
}

// service.status
export interface IServiceStatusRequest extends ISaltTargets {
  name: string;
}
export interface IServiceStatusResponse extends IGenericBooleanResponse {}
