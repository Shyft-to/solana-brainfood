"use client";

import { ShyftSdk, Network } from "@shyft-to/js";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { AccountCallbackDataType } from "@/types";
import Button from "./ui/button";

const shyft = new ShyftSdk({
  apiKey: process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
  network: Network.Mainnet,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export default function AccountCallbacks() {
  const [transactions, setTransactions] = useState<AccountCallbackDataType[]>(
    []
  );
  const [callbackId, setCallbackId] = useState<string>("");
  const [merkleTree, setMerkleTree] = useState("");
  const [tracking, setTracking] = useState(false);

  const trackEvents = async () => {
    try {
      if (!merkleTree) return;

      setTracking(true);
      const result = await shyft.callback.register({
        network: Network.Devnet,
        addresses: [merkleTree],
        type: "ACCOUNT",
        callbackUrl: `${window.location.href.replace(
          window.location.pathname,
          ""
        )}/api/account-callbacks`,
        encoding: "PARSED",
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
      .channel("shyft_merkle_tree_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shyft_merkle_tree_updates",
        },
        (payload) => {
          console.log(payload);
          setTransactions((txs) => [
            payload.new as AccountCallbackDataType,
            ...txs,
          ]);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto w-full mt-10">
      <div className="flex flex-col items-center max-w-lg mx-auto gap-6">
        <input
          type="search"
          id="search"
          className="block w-full px-4 py-2 text-sm text-slate-100 rounded-md shadow-sm bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Enter Merkle Tree Address"
          required
          name="merkleTree"
          value={merkleTree}
          onChange={(event) => setMerkleTree(event.target.value)}
        />

        <Button onClick={tracking ? untrackEvents : trackEvents}>
          {tracking ? "Stop Tracking" : "Track Account Update"}
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
        return (
          <pre
            className="bg-slate-700 rounded-2xl p-6 space-y-4 whitespace-pre-wrap"
            style={{
              wordWrap: "break-word",
            }}
          >
            {JSON.stringify(tx, null, 4)}
          </pre>
        );
      })}
    </div>
  );
}
