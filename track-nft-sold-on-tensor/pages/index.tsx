import { Typography } from "@/components/ui/typography"
import { useEffect, useMemo, useState } from "react"
import { formatDistance } from "date-fns"
import { getTransactionsInDay } from "@/lib/transactions"
import { NFTSaleTransactionTypeExtended } from "@/types"
import Image from "next/image"
import truncate from "@/utils/truncate"

const TENSOR_ADDRESS = "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN"

function getHourFrames() {
  const now = new Date()

  // Create a new date for the start of the day
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0) // Set to midnight

  // Initialize an array to store the hour frames
  const hourFrames = []

  // Loop to generate hour frames from the start of the day to now
  while (startOfDay < now) {
    // Format the current hour frame
    const formattedHourFrame = startOfDay.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    })

    // Add the formatted hour frame to the array
    hourFrames.push({ hour: startOfDay.getHours(), format: formattedHourFrame })

    // Move to the next hour frame
    startOfDay.setHours(startOfDay.getHours() + 1)
  }

  return hourFrames
}

export default function HomePage() {
  const [selectedHour, setSelectedHour] = useState(new Date().getHours())
  const [loading, setLoading] = useState(false)
  const [oldestTxnSignature, setOldestTxnSignature] = useState("")
  const [transactions, setTransactions] = useState<NFTSaleTransactionTypeExtended[]>([])

  const hourFrames = useMemo(() => getHourFrames(), [])

  useEffect(() => {
    setLoading(true)
    getTransactionsInDay(TENSOR_ADDRESS, selectedHour, oldestTxnSignature)
      .then(({ transactions, oldestTxnSignature = "" }) => {
        setOldestTxnSignature(oldestTxnSignature)
        setTransactions(transactions)
      })
      .finally(() => setLoading(false))
  }, [selectedHour])

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <Typography as="h4" level="h6" className="font-bold">
          Tensor NFTs Tracker
        </Typography>
        <select
          className="rounded-lg border border-gray-500 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
          value={selectedHour}
          onChange={(event) => setSelectedHour(Number(event.target.value))}
        >
          {hourFrames.map((frame) => (
            <option key={frame.format} value={frame.hour}>
              {frame.format}
            </option>
          ))}
        </select>
      </div>
      <div className="mx-auto max-w-2xl space-y-6">
        {loading ? <Loader /> : transactions.map((tx) => <NFTItem key={tx.nft?.mint} tx={tx} />)}
      </div>
    </>
  )
}

const NFTItem = ({ tx }: { tx: NFTSaleTransactionTypeExtended }) => {
  const { nft, actions, timestamp } = tx

  const action = actions.find((action) => action.type === "NFT_SALE" || action.type === "COMPRESSED_NFT_SALE")

  return (
    <div className="flex items-center gap-4 rounded-2xl p-4 shadow-card">
      <Image
        className="rounded-xl"
        src={nft?.cached_image_uri ?? nft?.image_uri ?? ""}
        alt={nft?.name ?? ""}
        width={120}
        height={120}
      />
      <div className="flex-1 py-4">
        <a href={`https://translator.shyft.to/address/${action?.info.nft_address}`} target="_blank">
          <Typography color="primary" className="font-semibold hover:underline">
            {nft?.name}
          </Typography>
        </a>
        <div className="mt-2 flex gap-2">
          <Typography level="body5" as="span" color="success" className="rounded-md bg-success-200 p-1 font-semibold">
            SALE
          </Typography>
          <Typography className="font-semibold">◎ {action?.info.price}</Typography>
        </div>
        <div className="mt-4 flex gap-2">
          <a href={`https://translator.shyft.to/address/${action?.info.seller}`} target="_blank">
            <Typography level="body4" className="font-semibold">
              {truncate(action?.info.seller ?? "", 8, false)}
            </Typography>
          </a>
          ➡️
          <a href={`https://translator.shyft.to/address/${action?.info.buyer}`} target="_blank">
            <Typography level="body4" className="font-semibold">
              {truncate(action?.info.buyer ?? "", 8, false)}
            </Typography>
          </a>
        </div>
      </div>
      <Typography level="body4" color="secondary" className="font-semibold">
        {formatDistance(new Date(timestamp), new Date(), { addSuffix: true })}
      </Typography>
    </div>
  )
}

const Loader = () => (
  <div className="flex flex-col items-center py-10">
    <svg className="h-8 w-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <Typography className="mt-2" level="body4" color="secondary">
      loading...
    </Typography>
  </div>
)
