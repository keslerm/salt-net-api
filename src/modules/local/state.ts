import { ISaltTargets } from "../common";

export interface IStateHighStateRequest extends ISaltTargets {}
export interface IStateHighStateResponse {
  [key: string]: {
    [key: string]: {
      __id__?: string;
      result: boolean;
      comment?: string;
      duration?: number;
      start_time?: string;
      changes?: {
        [key: string]: string;
      };
    };
  };
}

export interface IStateSlsRequest extends ISaltTargets {
  name: string;
  test?: boolean;
  exclude?: string;
}
export interface IStateSlsResponse extends IStateHighStateResponse {}
