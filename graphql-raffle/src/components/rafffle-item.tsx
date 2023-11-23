"use client";

import { RafffleItemType } from "@/types";
import { getTokenInfo } from "@/utils/token";
import format from "date-fns/format";

type RafffleItemProps = RafffleItemType;

export const RafffleItem = ({
  pubkey,
  prize,
  creator,
  startTimestamp,
  endTimestamp,
  ticketPrice,
  totalTickets,
  totalPrizes,
  mint,
}: RafffleItemProps) => {
  const { decimal, name } = getTokenInfo(mint);

  return (
    <div className="bg-slate-700 rounded-2xl p-6 space-y-6 w-full">
      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Rafffle</p>
        <h4 className="text-sm text-white font-semibold">{pubkey}</h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">NFT Price</p>
        <h4 className="text-sm text-white font-semibold">{prize}</h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Creator</p>
        <h4 className="text-sm text-white font-semibold">{creator}</h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Raffle Start Date:</p>
        <h4 className="text-sm text-white font-semibold">
          {format(new Date(startTimestamp * 1000), "MMM dd, yyyy, h:mm:ss a")}
        </h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Raffle End Date:</p>
        <h4 className="text-sm text-white font-semibold">
          {format(new Date(endTimestamp), "MMM dd, yyyy, h:mm:ss a")}
        </h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Ticket price:</p>
        <h4 className="text-sm text-white font-semibold">
          {decimal > 0
            ? `${(ticketPrice / Math.pow(10, decimal)).toFixed(4)} ${name}`
            : "--"}
        </h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Total tickets:</p>
        <h4 className="text-sm text-white font-semibold">{totalTickets}</h4>
      </div>

      <div className="flex justify-between gap-4">
        <p className="text-sm text-slate-400">Total prices:</p>
        <h4 className="text-sm text-white font-semibold">{totalPrizes}</h4>
      </div>
    </div>
  );
};
