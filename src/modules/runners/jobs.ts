import * as Core from "../core";

export interface ILookupJobRequest extends Core.IRunnerRequest {
  kwarg: {
    jid: string;
  };
}

/**
 * Looking up jobs that have a special outputter needs to be wrapped in it's own type, so this is provided as a convince. Ultimately
 * this is just one of the many Salt quirks that makes typing things out very difficult
 */
export interface ILookupJobWithOutputterResponse<T> {
  outputter: string;
  data: T
}

export interface IPrintJobRequest extends Core.IRunnerRequest {
  kwarg: {
    jid: string;
  };
}

// This is honestly a mess but it's the structure of it so yeah.
export interface IPrintJobResponse<T> {
  [key: string]: {
    Function: string;
    Arguments: string[];
    Target: string;
    "Target-type": string;
    User: string;
    StartTime: string;
    Result: {
      [key: string]: {
        id: string;
        cmd: string;
        fun: string;
        jid: string;
        out: string;
        "_stamp": string;
        return: T;
        retcode: number;
        success: boolean;
        fun_args: {
          mods: string;
        }[];
      }
    };
  }
}