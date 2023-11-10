"use client";

import { ShyftSdk, Network, TxnAction } from "@shyft-to/js";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/number";
import { CallbackDataModel } from "@/types";
import Button from "./ui/button";
import { formatDistance } from "date-fns";

const shyft = new ShyftSdk({
  apiKey: process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
  network: Network.Mainnet,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export default function TransactionCallbacks() {
  const [transactions, setTransactions] = useState<CallbackDataModel[]>([]);
  const [callbackId, setCallbackId] = useState<string>("");
  const [tracking, setTracking] = useState(false);

  const trackEvents = async () => {
    try {
      setTracking(true);
      const result = await shyft.callback.register({
        network: Network.Mainnet,
        addresses: ["JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB"],
        callbackUrl: `${window.location.href.replace(
          window.location.pathname,
          ""
        )}/api/transaction-callbacks`,
        events: [TxnAction.SWAP],
      });

      setCallbackId(result.id);

      console.log("success");
    } catch (error) {
      console.error(error);
    }
  };

  const untrackEvents = async () => {
    await shyft.callback.remove({
      id: callbackId,
    });
    setCallbackId("");
    setTracking(false);
  };

  useEffect(() => {
    const channel = supabase
      .channel("shyft_jupiter_swap_events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shyft_jupiter_swap_events",
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
      <div className="flex justify-center">
        <Button onClick={tracking ? untrackEvents : trackEvents}>
          {tracking ? "Stop Tracking" : "Track Swap Events"}
        </Button>
      </div>

      <div className="max-w-xl mx-auto space-y-4 mt-10">
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
      </div>

      {transactions.map((tx) => {
        const action = tx.action;
        const signature = tx.signatures?.[0];

        return (
          <a
            className="block mb-4"
            target="_blank"
            key={signature}
            href={`https://translator.shyft.to/tx/${signature}`}
          >
            <div className="bg-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-yellow-500 font-bold text-xl">SWAP</h3>
                <span>
                  {formatDistance(new Date(tx.timestamp), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex gap-4">
                <img
                  className="w-6 h-6"
                  src={action?.info?.tokens_swapped?.in?.image_uri}
                />

                <span>
                  {formatNumber(action?.info?.tokens_swapped?.in?.amount)}{" "}
                  {action?.info?.tokens_swapped?.in?.symbol}
                </span>

                <img className="w-6 h-6" src="/assets/icon-swap.svg" />

                <img
                  className="w-6 h-6"
                  src={action?.info?.tokens_swapped?.out?.image_uri}
                />

                <span>
                  {formatNumber(action?.info?.tokens_swapped?.out?.amount)}{" "}
                  {action?.info?.tokens_swapped?.out?.symbol}
                </span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
