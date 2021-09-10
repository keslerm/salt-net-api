export interface ISaltConfigOptions {
  endpoint: string;
  username: string;
  password: string;
  eauth: string;
}
export interface ISaltCommandRequest {
  [key: string]: any;
  tgt?: string;
  fun: string;
  client: string;
  arg?: string[];
  kwarg?: any;
  pillar?: any;
}

interface ISaltTargets {
  tgt: string;
  tgt_type?: string;
}

// Local
export interface ILocalGenericResponse {
  [key: string]: unknown 
}

// Ping
export interface ITestPingRequest extends ISaltTargets {}
export interface ITestPingResult {
  [key: string]: boolean;
}

// Service
export interface IServiceRestartRequest extends ISaltTargets {
  name: string;
}
export interface IServiceRestartResponse {
  [key: string]: boolean;
}

// Grains
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
  }
}

// Highstate
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
      }
    }
  };
}

// Wheel
export interface IListKeysResponse {
  minions: string[];
  minions_pre: string[];
  minions_rejected: string[];
  minions_denied: string[];
  local: string[],
}

export interface IListKeysRequest {
  match?: string;
}

export interface IAcceptKeyRequest {
  match: string;
  include_rejected?: boolean;
  include_denied?: boolean;
}

export interface IAcceptKeyResponse {
  minions: string[];
}