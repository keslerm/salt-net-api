import { ISaltTargets } from "../common";

export interface IGrainsSetRequest extends ISaltTargets {
  key: string;
  value: string;
  force?: boolean;
  destructive?: boolean;
  delimiter?: string;
}

export interface IGrainsSetResponse {
  [key: string]: {
    comment: string;
    changes: [key: string];
    result: boolean;
  };
}
