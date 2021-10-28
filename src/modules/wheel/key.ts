import { Core } from '../../index';

export interface IListRequest extends Core.IRunnerRequest  {
  match?: string;
}
export interface IListResponse {
  minions: string[];
  minions_pre: string[];
  minions_rejected: string[];
  minions_denied: string[];
  local: string[];
}

// key.accept
export interface IAcceptRequest extends Core.IRunnerRequest {
  match: string;
  include_rejected?: boolean;
  include_denied?: boolean;
}
export interface IAcceptResponse {
  minions: string[];
}
