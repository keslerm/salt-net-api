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
