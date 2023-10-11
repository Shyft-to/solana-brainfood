"use client";

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { NFTBid } from "@/types";
import Image from "next/image";
import truncate from "@/utils/truncate";
import { formatDistance } from "date-fns";
import SearchForm from "./search-form";

export default function BidTable() {
  const [collection, setCollection] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "finised">(
    "idle"
  );
  const [bids, setBids] = useState<NFTBid[]>([]);

  const handleSearch = async () => {
    try {
      if (!collection) return;
      setStatus("processing");

      const { data } = await supabase
        .from("shyft_magic_eden_bid_events")
        .select("*")
        .eq("nft_collection", collection)
        .order("created_at", { ascending: false });

      setBids(data as NFTBid[]);
    } catch (error) {
      console.error(error);
    } finally {
      setStatus("finised");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto w-full mt-10">
      <SearchForm
        value={collection}
        setValue={setCollection}
        onSearch={handleSearch}
      />
      <Table className="mt-20">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Name</TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {status === "processing" && (
            <TableRow>
              <TableCell className="text-center" colSpan={4}>
                <svg
                  className="h-8 w-8 animate-spin inline-block my-4"
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
              </TableCell>
            </TableRow>
          )}

          {status === "finised" && bids.length === 0 && (
            <TableRow>
              <TableCell className="text-center" colSpan={4}>
                No item
              </TableCell>
            </TableRow>
          )}

          {bids?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="rounded-md w-14 h-14 shrink-0 overflow-hidden">
                    <Image
                      src={item.nft_image}
                      width={56}
                      height={56}
                      alt={item.nft_name}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href={`https://translator.shyft.to/address/${item.nft_address}`}
                      target="_blank"
                    >
                      <h3 className="font-semibold">#{item.nft_symbol}</h3>
                    </a>
                    <p className="text-sm text-gray-200">{item.nft_name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={`https://translator.shyft.to/address/${item.bidder}`}
                  target="_blank"
                >
                  {truncate(item.bidder, 24, true)}
                </a>
              </TableCell>
              <TableCell>◎{item.price / 10 ** 9}</TableCell>
              <TableCell>
                {formatDistance(new Date(item.created_at), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
