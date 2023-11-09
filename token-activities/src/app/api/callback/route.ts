import { supabase } from "@/lib/supabase";
import { CallbackDataType } from "@/types";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { TxnAction } from "@shyft-to/js";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = (await req.json()) as CallbackDataType;

  if (
    !body.type ||
    !body.actions ||
    ![TxnAction.TOKEN_MINT, TxnAction.TOKEN_BURN, TxnAction.SWAP].includes(
      body.type as TxnAction
    )
  )
    return res.status(400).json({ message: "Invalid callback data" });

  const action = body.actions.find((action) => action.type === body.type);

  if (body.status !== "Success") return;

  if (!action)
    return res.status(400).json({ message: "Invalid callback data" });

  const { error } = await supabase.from("shyft_token_activities").insert({
    type: body.type,
    timestamp: body.timestamp,
    signatures: body.signatures,
    action,
  });

  if (error) return res.status(500).json({ message: "Insert error" });

  return Response.json(body);
}
