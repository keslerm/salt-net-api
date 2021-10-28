import * as Core from "../core";

export interface IPrintJobRequest extends Core.IRunnerRequest {
  kwarg: {
    jid: string;
  };
}

// This is honestly a mess but it's the structure of it so yeah.
export interface IPrintJobResult<T> {
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