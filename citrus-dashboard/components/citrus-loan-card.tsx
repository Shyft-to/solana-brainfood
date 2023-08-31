import Image from "next/image"
import { Typography } from "./ui/typography"
import { Database } from "@/types/supabase.types"
import truncate from "@/utils/truncate"
import formatDuration from "@/utils/duration"

export function CitrusLoanCard({
  activity,
}: {
  activity: Database["public"]["Tables"]["shyft_citrus_activities"]["Row"]
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center gap-4">
        <Image
          src={
            // @ts-ignore
            activity?.nft?.cached_image_uri ??
            // @ts-ignore
            activity?.nft?.image_uri ??
            "https://user-images.githubusercontent.com/47315479/81145216-7fbd8700-8f7e-11ea-9d49-bd5fb4a888f1.png"
          }
          width={80}
          height={80}
          alt="NFT"
          className="rounded-xl"
        />
        {/* @ts-ignore */}
        <Typography className="font-bold">{activity?.nft?.name}</Typography>
      </div>
      <div className="flex justify-between gap-3">
        <div className="space-y-2 text-center">
          <Typography as="p" level="body4" color="secondary">
            Lender
          </Typography>
          <Typography className="font-bold">{truncate(activity?.lender ?? "", 8, true)}</Typography>
        </div>
        <div className="space-y-2 text-center">
          <Typography as="p" level="body4" color="secondary">
            Borrower
          </Typography>
          <Typography className="font-bold">{truncate(activity?.borrower ?? "", 8, true)}</Typography>
        </div>
        <div className="space-y-2 text-center">
          <Typography as="p" level="body4" color="secondary">
            Amount
          </Typography>
          <Typography className="font-bold">{activity.amount} SOL</Typography>
        </div>
        <div className="space-y-2 text-center">
          <Typography as="p" level="body4" color="secondary">
            APY
          </Typography>
          <Typography className="font-bold">{activity.apy}%</Typography>
        </div>
        <div className="space-y-2 text-center">
          <Typography as="p" level="body4" color="secondary">
            Duration
          </Typography>
          <Typography className="font-bold">{formatDuration(activity.loan_duration_seconds ?? 0)}</Typography>
        </div>
      </div>
    </div>
  )
}
