"use client";

import { ShyftSdk, Network, TxnAction, TokenInfo } from "@shyft-to/js";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import SearchForm from "./search-form";
import { formatNumber } from "@/utils/number";
import truncate from "@/utils/truncate";
import { CallbackDataModel } from "@/types";

const shyft = new ShyftSdk({
  apiKey: process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
  network: Network.Mainnet,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export default function BidTable() {
  const [token, setToken] = useState("");
  const [tracking, setTracking] = useState(false);
  const [transactions, setTransactions] = useState<CallbackDataModel[]>([]);
  const [metadata, setMetadata] = useState<TokenInfo | null>(null);

  const handleSearch = async () => {
    try {
      setMetadata(null);
      setTransactions([]);
      setTracking(true);
      const tokenInfo = await shyft.token.getInfo({ tokenAddress: token });
      setMetadata(tokenInfo);

      await shyft.callback.register({
        network: Network.Mainnet,
        addresses: [token],
        callbackUrl: `${window.location.href}api/callback`,
        events: [TxnAction.TOKEN_MINT, TxnAction.TOKEN_BURN, TxnAction.SWAP],
      });

      console.log("success");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("shyft_token_ticker")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shyft_token_ticker",
        },
        (payload) => {
          console.log(payload);
          setTransactions((txs) => [payload.new as CallbackDataModel, ...txs]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto w-full mt-10">
      <SearchForm value={token} setValue={setToken} onSearch={handleSearch} />

      <div className="max-w-xl mx-auto space-y-4 mt-10">
        {metadata && (
          <div className="flex gap-5 pb-5 border-b border-gray-100">
            <img
              src={metadata.image}
              alt={metadata.name}
              className="w-[160px] h-auto object-cover"
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold text-white">{metadata.name}</h3>
              <p className="text-sm">{`Symbol: ${metadata.symbol}`}</p>
              <p className="text-sm">{`Decimal: ${metadata.decimals}`}</p>
              <p className="text-sm">{`Current Supply: ${formatNumber(
                metadata.current_supply
              )}`}</p>
            </div>
          </div>
        )}

        {tracking && (
          <div className="flex justify-center py-6">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Waiting for events
          </div>
        )}

        {transactions.map((tx, idx) => {
          const action = tx.action;

          let icon;
          let text;
          if (tx.type === TxnAction.SWAP) {
            icon = "🔁";

            text = (
              <p key={idx}>{`${formatNumber(
                action?.info?.tokens_swapped?.in?.amount
              )} ${
                action?.info?.tokens_swapped?.in?.name
              } swapped with ${formatNumber(
                action?.info?.tokens_swapped?.out?.amount
              )} ${action?.info?.tokens_swapped?.out?.name}`}</p>
            );
          }

          if (tx.type === TxnAction.TOKEN_MINT) {
            icon = "🆕";

            text = (
              <p key={idx}>{`${formatNumber(action?.info.amount)} ${truncate(
                action?.info.token_address ?? "",
                8,
                true
              )} has been minted`}</p>
            );
          }

          if (tx.type === TxnAction.TOKEN_BURN) {
            icon = "🔥";

            text = (
              <p key={idx}>{`${formatNumber(action?.info.amount)} ${
                metadata?.name
              } just got burned`}</p>
            );
          }

          return (
            <div className="bg-slate-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-yellow-500 font-bold text-xl">
                {tx.type} {icon}
              </h3>
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
