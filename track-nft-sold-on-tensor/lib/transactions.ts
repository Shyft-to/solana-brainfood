import { NFTResponse, NFTSaleTransactionType, NFTSaleTransactionTypeExtended, ShyftBaseResponse } from "@/types"
import { isAfter, isBefore, endOfHour, startOfHour } from "date-fns"

export async function getTransactionsInDay(address: string, hour: number, oldestSignature?: string) {
  let allTransactions: NFTSaleTransactionTypeExtended[] = []
  let oldestTxnSignature = oldestSignature
  let isComplete = false

  const date = new Date().setHours(hour)

  try {
    while (!isComplete) {
      const response = await fetch(
        `https://api.shyft.to/sol/v1/transaction/history?network=mainnet-beta&tx_num=50&account=${address}${
          oldestTxnSignature ? `&before_tx_signature=${oldestTxnSignature}` : ""
        }`,
        {
          headers: {
            "Content-type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
          },
        }
      )

      type JSONResponse = ShyftBaseResponse<Array<NFTSaleTransactionType>>

      const transactionData = (await response.json()) as JSONResponse

      const transactions = transactionData.result

      if (transactions.length === 0) {
        isComplete = true
        break
      }

      const lastTransaction = transactions[transactions.length - 1]

      if (isBefore(new Date(lastTransaction.timestamp), startOfHour(date))) {
        isComplete = true
      }

      oldestTxnSignature = transactions[transactions.length - 1].signatures[0]

      let nftSaleTransactions = transactions.filter(
        (tx) =>
          (tx.type === "NFT_SALE" || tx.type === "COMPRESSED_NFT_SALE") &&
          isAfter(new Date(lastTransaction.timestamp), startOfHour(date)) &&
          isBefore(new Date(lastTransaction.timestamp), endOfHour(date))
      )

      nftSaleTransactions = await Promise.all(
        nftSaleTransactions.map(async (tx) => {
          const action = tx.actions.find(
            (action) => action.type === "NFT_SALE" || action.type === "COMPRESSED_NFT_SALE"
          )

          if (action) {
            const response = await fetch(
              `https://api.shyft.to/sol/v1/nft/read?network=mainnet-beta&token_address=${action.info.nft_address}`,
              {
                headers: {
                  "Content-type": "application/json",
                  "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
                },
              }
            )

            type JSONResponse = ShyftBaseResponse<NFTResponse>

            const nftData = (await response.json()) as JSONResponse

            const nft = nftData.result

            return {
              ...tx,
              nft,
            } as NFTSaleTransactionTypeExtended
          }

          return tx as NFTSaleTransactionTypeExtended
        })
      )

      allTransactions = [...nftSaleTransactions, ...allTransactions]

      // if (allTransactions.length > 5) {
      //   isComplete = true
      //   break
      // }
    }
  } catch (error) {
    console.error(error)
  }

  return {
    transactions: allTransactions,
    oldestTxnSignature,
  }
}
