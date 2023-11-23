"use client";
import SearchForm from "@/components/search-form";
import { RafffleItemType } from "@/types";
import { gql, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { SortBy } from "../components/sort-by";
import { RafffleItem } from "../components/rafffle-item";
import { Loader2Icon } from "lucide-react";
import { SortByMint } from "../components/sort-by-mint";
import Button from "../components/ui/button";

export const dynamic = "force-dynamic";

const query = gql`
  query FFF_Raffle_Raffle(
    $where: FFF_Raffle_Raffle_bool_exp
    $orderBy: [FFF_Raffle_Raffle_order_by!]
    $offset: Int
    $limit: Int
  ) {
    FFF_Raffle_Raffle(
      where: $where
      order_by: $orderBy
      offset: $offset
      limit: $limit
    ) {
      pubkey
      creator
      winner
      winnerCount
      mint
      entrants
      prize
      cm
      endTimestamp
      ticketPrice
      totalTickets
      totalPrizes
      lamports
      numberSold
      limit
      holderOnly
      fox
      claimedPrizes
      randomness
      startTimestamp
    }
  }
`;

const ITEM_PER_PAGE = 10;

export default function HomePage() {
  const [creator, setCreator] = useState("");
  const [sortBy, setSortBy] = useState("startTimestamp-desc");
  const [mint, setMint] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadOver, setLoadOver] = useState(false);

  const variables = useMemo(() => {
    const [sortByField, sortByDirection] = sortBy.split("-");

    return {
      where: {
        ...(creator && {
          creator: {
            _regex: creator,
          },
        }),
        ...(mint && {
          mint: {
            _regex: mint,
          },
        }),
      },
      orderBy: [
        {
          [sortByField ?? "startTimestamp"]: sortByDirection ?? "desc",
        },
      ],
      limit: ITEM_PER_PAGE,
      offset: 0,
    };
  }, [creator, mint, sortBy]);

  const { loading, data, fetchMore } = useQuery(query, {
    variables,
  });

  const raffles = (data?.FFF_Raffle_Raffle ?? []) as RafffleItemType[];

  const loadMore = () => {
    setLoadingMore(true);
    fetchMore({
      variables: {
        ...variables,
        offset: raffles.length,
      },
    })
      .then(({ data }) => {
        const proposals = (data?.FFF_Raffle_Raffle ?? []) as RafffleItemType[];
        if (proposals.length < ITEM_PER_PAGE) {
          setLoadOver(true);
        }
      })
      .finally(() => setLoadingMore(false));
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 md:px-8 py-24 max-w-screen-lg mx-auto">
      <div className="flex items-center gap-5 justify-between w-full">
        <div className="flex-1">
          <SearchForm value={creator} setValue={setCreator} />
        </div>
        <div className="flex items-center">
          <SortBy value={sortBy} onValueChange={setSortBy} />

          <SortByMint value={mint} onValueChange={setMint} />
        </div>
      </div>
      <div className="mt-10 w-full space-y-5">
        {loading && (
          <div className="flex justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}

        {raffles.map((raffle) => (
          <RafffleItem key={raffle.pubkey} {...raffle} />
        ))}

        {raffles.length > 0 && !loadOver && (
          <div className="flex justify-center">
            <Button className="flex items-center gap-2" onClick={loadMore}>
              {loadingMore && <Loader2Icon className="animate-spin" />}
              Load more
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
