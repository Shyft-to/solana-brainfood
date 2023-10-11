export type NFTBid = {
  id: string;
  created_at: string;
  bidder: string;
  currency: string;
  marketplace: string;
  price: number;
  nft_address: string;
  nft_name: string;
  nft_image: string;
  nft_description?: string;
  nft_symbol: string;
  nft_collection?: string;
  nft_collection_name?: string;
};

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
