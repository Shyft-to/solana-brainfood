export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type CallbackType = {
  fee: number
  type: string
  status: string
  actions: Array<{
    info: {
      lender: string
      borrower: string
      currency: string
      amount: number
      nft_address: string
      loan: string
      escrow: string
      escrow_token_account: string
      order_book: string
      apy: number
      loan_duration_seconds: number
      discount: number
      transfer_to_borrower: number
    }
    type: string
    source_protocol: {
      name: string
      address: string
    }
  }>
  signers: Array<string>
  accounts: Array<{
    data: string
    owner: string
    address: string
    lamports: number
  }>
  protocol: {
    name: string
    address: string
  }
  fee_payer: string
  timestamp: string
  signatures: Array<string>
}

export type ShyftBaseResponse<T> = {
  success: boolean
  message: string
  result: T
}

export interface TransactionBaseType {
  timestamp: string
  fee: number
  fee_payer: string
  signers: Array<string>
  signatures: Array<string>
  protocol: {
    address: string
    name: string
  }
  type: string
  status: string
}

export interface NFTSaleTransactionType extends TransactionBaseType {
  actions: Array<{
    info: {
      buyer: string
      seller: string
      currency: string
      marketplace: string
      nft_address: string
      price: number
    }
    source_protocol: {
      address: string
      name: string
    }
    type: string
  }>
}

export type NFTResponse = {
  name: string
  symbol: string
  royalty: number
  image_uri: string
  cached_image_uri: string
  animation_url: string
  cached_animation_url: string
  metadata_uri: string
  description: string
  mint: string
  owner: string
  update_authority: string
  creators: Array<{
    address: string
    share: number
    verified: boolean
  }>
  collection: {
    address: string
    verified: boolean
    name: string
    family: string
  }
  attributes: {
    Background: string
    Skin: string
    Outfit: string
    Headwear: string
    Eyes: string
    Mouth: string
    Eyewear: string
  }
  attributes_array: Array<{
    trait_type: string
    value: string
  }>
  files: Array<{
    uri: string
    type: string
  }>
  external_url: string
  is_loaded_metadata: boolean
  primary_sale_happened: boolean
  is_mutable: boolean
  token_standard: string
  is_compressed: boolean
  merkle_tree: string
}

export interface NFTSaleTransactionTypeExtended extends NFTSaleTransactionType {
  nft?: NFTResponse
}
