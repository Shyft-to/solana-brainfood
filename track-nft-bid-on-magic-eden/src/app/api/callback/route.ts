import { supabase } from "@/lib/supabase";
import { CallbackDataType } from "@/types";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = (await req.json()) as CallbackDataType;

  console.log({ body });

  if (!body.type || !body.actions || body.type !== "NFT_BID")
    return res.status(400).json({ message: "Invalid callback data" });

  const action = body.actions.find((action) => action.type === "NFT_BID");

  console.log("action", action);

  if (!action)
    return res.status(400).json({ message: "Invalid callback data" });

  const response = await fetch(
    `https://api.shyft.to/sol/v1/nft/read?network=mainnet-beta&token_address=${action.info.nft_address}&refresh=true&token_record=true`,
    {
      headers: {
        "x-api-key": process.env.SHYFT_API_KEY!,
        accept: "application/json",
      },
    }
  );

  const data = await response.json();

  const nft = data.result;

  const { error } = await supabase.from("shyft_magic_eden_bid_events").insert({
    ...action.info,
    nft_name: nft.name,
    nft_image: nft.cached_image_uri ?? nft.image_uri,
    nft_description: nft.description,
    nft_symbol: nft.symbol,
    nft_collection: nft?.collection?.address,
    nft_collection_name: nft?.collection?.name,
  });

  if (error) return res.status(500).json({ message: "Insert error" });

  return Response.json(body);
}
