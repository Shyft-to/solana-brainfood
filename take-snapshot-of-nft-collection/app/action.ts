"use server";

import { revalidatePath } from "next/cache";
import { ShyftSdk, Network, Nft } from "@shyft-to/js";

export async function findHolders(collection: string) {
  try {
    console.log(collection);
    revalidatePath("/");

    const shyft = new ShyftSdk({
      apiKey: process.env.SHYFT_API_KEY!,
      network: Network.Mainnet,
    });

    let page: any = 1;
    let allNFTs: Nft[] = [];

    while (page) {
      console.log("fetch page: ", page);

      const response = await shyft.nft.collection.getNfts({
        collectionAddress: collection,
        page,
        size: 50,
      });

      allNFTs.push(...response.nfts);

      if (response.total_count < 50) {
        page = false;
      } else {
        page++;
      }
    }

    const owners = new Set(allNFTs.map((nft) => nft.owner));

    return { success: true, data: Array.from(owners) as string[] };
  } catch (error: any) {
    return { success: false, error: error?.message || "Unknown error" };
  }
}
