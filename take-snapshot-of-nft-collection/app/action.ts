"use server";

import { revalidatePath } from "next/cache";
import { ShyftSdk, Network, Nft, DAS } from "@shyft-to/js";

export async function findHolders(collection: string) {
  try {
    console.log(collection);
    revalidatePath("/");

    const shyft = new ShyftSdk({
      apiKey: process.env.SHYFT_API_KEY!,
      network: Network.Mainnet,
    });

    let page: any = 1;
    let allNFTs: DAS.GetAssetResponse[] = [];

    while (page) {
      console.log("fetch page: ", page);

      const response = await shyft.rpc.getAssetsByGroup({
        groupValue: collection,
        groupKey: "collection",
        sortBy: { sortBy: "created", sortDirection: "asc" },
        page,
        limit: 1000,
      });

      console.log("fetch page: ", page, response);

      allNFTs.push(...response.items);

      if (response.total < 1000) {
        page = false;
      } else {
        page++;
      }
    }

    const owners = new Set(allNFTs.map((nft) => nft.ownership.owner));

    return { success: true, data: Array.from(owners) as string[] };
  } catch (error: any) {
    return { success: false, error: error?.message || "Unknown error" };
  }
}
