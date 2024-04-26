export interface GetResponse {
  cursor: string | null;
}

export interface IMovementQuery {
  cursor?: string;
  start_date?: number;
  end_date?: number;
  sources?: string[];
  labels?: string[];
  assets?: string[];
  addresses?: string[];
  transaction_hashes?: string[];
}

export interface IMovementResponseData {
  id: string;
  transaction_id: string;
  transaction_hash: string | null;
  transaction_date: number;
  source_id: string;
  other_party?: {
    address: string;
    blockchain: string;
  };
  volume: string;
  asset_to_usd_rate: string | null;
  usd_to_fiat_rate: string | null;
  is_fee: boolean;
  direction: 'in' | 'out';
  asset: string;
  note?: string;
  labels: string[];
  cost_basis: string | null;
  gains: string | null;
  cost_basis_error: string | null;
}

export interface GetMovementsResponse extends GetResponse {
  data: IMovementResponseData[];
}

export interface ILabelQuery {
  id: string;
}

export interface ILabelBody {
  movements?: string[];
  transaction_hashes?: string[];
}
