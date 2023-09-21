import shyftClient from "@/lib/shyft"
import { Network, TxnAction } from "@shyft-to/js"
import { NextApiRequest, NextApiResponse } from "next"

export type BaseResponse = {
  success: boolean
  data?: Object
  error?: string
}

const CITRUS_PROGRAM_ID = "JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp"

export default async function handler(req: NextApiRequest, res: NextApiResponse<BaseResponse>) {
  if (req.method === "POST") {
    try {
      await shyftClient.callback.register({
        network: Network.Mainnet,
        addresses: [CITRUS_PROGRAM_ID],
        callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL!}/api/callback`,
        events: [TxnAction.TAKE_LOAN],
      })

      res.status(200).json({ success: true, data: "Registered successfuly" })
    } catch (err: any) {
      console.error(err)

      res.status(500).json({ success: false, error: err?.message })
      return
    }
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }
}
