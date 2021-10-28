import * as Core from "../core";

export interface ISetRequest extends Core.ILocalRequest {
  kwarg: {
    key: string;
    value: string;
    force?: boolean;
    destructive?: boolean;
    delimiter?: string;
  }
}

export interface ISetResponse {
  [key: string]: {
    comment: string;
    changes: [key: string];
    result: boolean;
  };
}