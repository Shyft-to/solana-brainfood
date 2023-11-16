"use client";
import SearchForm from "@/components/search-form";
import Button from "@/components/ui/button";
import { ProposalType } from "@/types";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

export const dynamic = "force-dynamic";

const query = gql`
  query GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw_ProposalV2(
    $where: GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw_ProposalV2_bool_exp
    $orderBy: [GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw_ProposalV2_order_by!]
    $limit: Int
    $offset: Int
  ) {
    GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw_ProposalV2(
      where: $where
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
      name
      pubkey
      descriptionLink
    }
  }
`;

const ITEM_PER_PAGE = 10;

export default function Home() {
  const [text, setText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loadOver, setLoadOver] = useState(false);

  const [getProposals, { loading, data, fetchMore }] = useLazyQuery(query);

  const proposals =
    (data?.GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw_ProposalV2 ??
      []) as ProposalType[];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getProposals({
      variables: {
        where: {
          name: {
            _regex: text,
          },
        },
        orderBy: [
          {
            draftAt: sortBy || "desc",
          },
        ],
        limit: ITEM_PER_PAGE,
        offset: 0,
      },
    })
  };

  const loadMore = () => {
    fetchMore({
      variables: {
        where: {
          name: {
            _regex: text,
          },
        },
        orderBy: [
          {
            draftAt: sortBy || "desc",
          },
        ],
        limit: ITEM_PER_PAGE,
        offset: proposals.length,
      },
    }).then(({ data }) => {
      const proposals =
        (data?.GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw_ProposalV2 ??
          []) as ProposalType[];
      if (proposals.length < ITEM_PER_PAGE) {
        setLoadOver(true);
      }
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 md:px-8 py-24 max-w-2xl mx-auto">
      <h3 className="text-3xl font-bold mb-10">
        Shyft GraphQL Program API Demo
      </h3>
      <SearchForm
        value={text}
        setValue={setText}
        onSearch={handleSearch}
        loading={loading}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="mt-10 w-full space-y-5">
        {proposals.map((proposal) => (
          <ProposalItem
            key={proposal.pubkey}
            name={proposal.name ?? ""}
            description={proposal.descriptionLink}
            pubkey={proposal.pubkey}
          />
        ))}

        {proposals.length > 0 && !loadOver && (
          <div className="flex justify-center">
            <Button onClick={loadMore}>
              {loading ? "Loading more" : "Load more"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

type ProposalItemProps = {
  name: string;
  description?: string;
  pubkey?: string;
};

const ProposalItem = ({ name, description, pubkey }: ProposalItemProps) => {
  return (
    <div className="bg-slate-700 rounded-2xl p-6 space-y-4 w-full">
      <h3 className="text-white font-bold text-lg truncate">{name}</h3>
      <p className="text-slate-400 text-sm mt-1 truncate">{description}</p>
      <a
        target="_blank"
        href={`https://translator.shyft.to/address/${pubkey}`}
        className="block text-blue-500 font-semibold text-sm mt-2 underline cursor-pointer"
      >
        {pubkey}
      </a>
    </div>
  );
};
