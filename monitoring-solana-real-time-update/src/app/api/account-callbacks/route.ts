import { supabase } from "@/lib/supabase";
import { AccountCallbackDataType } from "@/types";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = (await req.json()) as AccountCallbackDataType;

  console.dir(body, { depth: null });

  if (!body.account || !body.accountInfo)
    return res.status(400).json({ message: "Invalid callback data" });

  const { error } = await supabase.from("shyft_merkle_tree_updates").insert({
    account: body.account,
    accountInfo: body.accountInfo,
  });

  if (error) return res.status(500).json({ message: "Insert error" });

  return Response.json({});
}
