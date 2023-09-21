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
