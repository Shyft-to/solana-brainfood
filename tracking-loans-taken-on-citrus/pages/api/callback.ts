import shyftClient from "@/lib/shyft"
import supabase from "@/lib/supabase"
import { CallbackType } from "@/types"
import { Network } from "@shyft-to/js"
import { NextApiRequest, NextApiResponse } from "next"

type BaseResponse = {
  success: boolean
  data?: Object
  error?: string
}

export type RequestBody = {
  tree: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: CallbackType
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<BaseResponse>) {
  if (req.method === "POST") {
    try {
      const callbackData = req.body

      if (callbackData && callbackData.type === "TAKE_LOAN" && callbackData.actions) {
        const type = callbackData.type
        const action = callbackData.actions.find((action) => action.type === type)
        if (!action) {
          return res.status(400).json({ success: true, error: "Invalid callback data" })
        }

        // fetch the detail of the NFT
        const nft = await shyftClient.nft.getNftByMint({ mint: action.info.nft_address, network: Network.Mainnet })

        await supabase.from("shyft_citrus_activities").insert({
          ...action.info,
          info: action.info,
          nft,
        })

        res.status(200).json({ success: true, error: "Success" })
      } else {
        return res.status(400).json({ success: true, error: "Invalid callback data" })
      }
    } catch (err: any) {
      console.error(err)

      res.status(500).json({ success: false, error: err?.message })
      return
    }
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }
}
