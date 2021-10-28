import * as Core from "../core";

export interface IRestartRequest extends Core.ILocalRequest {
  kwarg: {
    name: string;
  }
}
export interface IRestartResponse {
  [key: string]: string | boolean;
}

export interface IStatusRequest extends Core.ILocalRequest {
  kwarg: {
    name: string;
  }
}
export interface IStatusResponse extends Core.IGenericBooleanResponse {}
