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

interface IGenericBooleanResponse {
  [key: string]: boolean;
}

interface IGenericStringResponse {
  [key: string]: string;
}

// Local
export interface IGenericResponse {
  [key: string]: any;
}

// test.ping
export interface ITestPingRequest extends ISaltTargets {}
export interface ITestPingResponse extends IGenericBooleanResponse {}

// service.restart
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

// grains.set
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

// state.highstate
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

// state.sls
export interface IStateSlsRequest extends ISaltTargets {
  name: string;
  test?: boolean;
  exclude?: string;
}
export interface IStateSlsResponse extends IStateHighStateResponse {}

// key.list_all
export interface IListKeysResponse {
  minions: string[];
  minions_pre: string[];
  minions_rejected: string[];
  minions_denied: string[];
  local: string[];
}
export interface IListKeysRequest {
  match?: string;
}

// key.accept
export interface IAcceptKeyRequest {
  match: string;
  include_rejected?: boolean;
  include_denied?: boolean;
}
export interface IAcceptKeyResponse {
  minions: string[];
}
