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

export interface ISaltTargets {
  tgt: string;
  tgt_type?: string;
}

export interface IGenericBooleanResponse {
  [key: string]: boolean;
}

export interface IGenericStringResponse {
  [key: string]: string;
}

export interface IGenericResponse {
  [key: string]: any;
}
