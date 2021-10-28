import * as Core from "../core";

export interface IRestartRequest extends Core.ILocalRequest {
  kwarg: {
    name: string;
  }
}
export interface IRestartResponse {
  [key: string]: {
    result: string | boolean;
  };
}

export interface IStatusRequest extends Core.ILocalRequest {
  kwarg: {
    name: string;
  }
}
export interface IStatusResponse extends Core.IGenericBooleanResponse {}
