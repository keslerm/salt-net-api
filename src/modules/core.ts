export interface IGenericBooleanResponse {
  [key: string]: boolean;
}

export interface IGenericStringResponse {
  [key: string]: string;
}

export interface IGenericResponse {
  [key: string]: any;
}

/**
 * Request for executing Salt commands against the local or local_async client
 */
export interface ILocalRequest {
  fun: string;
  tgt: string;
  tgt_type?: string;
  arg?: string;
  kwarg?: unknown;
}

/**
 * Response from the Salt API when executing a local_async command
 */
export interface ILocalAsyncResponse {
  jid: string;
  minions: string[];
}

export interface IWheelRequest {
  fun: string;
  arg?: string;
}

export interface IRunnerRequest {
  fun: string;
  kwarg?: unknown;
}