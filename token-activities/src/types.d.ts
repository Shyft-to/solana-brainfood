export type CallbackDataType = {
  timestamp: string;
  fee: number;
  fee_payer: string;
  signers: Array<string>;
  signatures: Array<string>;
  protocol: {
    address: string;
    name: string;
  };
  type: string;
  status: string;
  actions: Array<{
    info: {
      bidder: string;
      currency: string;
      marketplace: string;
      price: number;
      nft_address: string;
    };
    source_protocol: {
      address: string;
      name: string;
    };
    type: string;
  }>;
  accounts: Array<any>;
};

export type CallbackDataModel = {
  id: string;
  created_at: string;
  type: string;
  timestamp: string;
  action: {
    info: any;
    type: string;
    parent_protocol?: string;
    source_protocol: {
      name: string;
      address: string;
    };
  };
};
