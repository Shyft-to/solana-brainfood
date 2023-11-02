import { ShyftSdk, Network, TransactionHistory } from "@shyft-to/js";

type TransactionHistoryItem = TransactionHistory[0] & {
  status: "Success" | "Fail";
};

const shyft = new ShyftSdk({
  apiKey: process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
  network: Network.Mainnet,
});

export const getTokenTicker = async (token: string, lastSignature?: string) => {
  const txs = (await shyft.transaction.history({
    account: token,
    txNum: 50,
    beforeTxSignature: lastSignature,
  })) as TransactionHistoryItem[];

  const successTx = txs.filter((tx) => tx.status === "Success");

  return { txs: successTx, signature: txs?.[txs.length - 1].signatures?.[0] };
};
