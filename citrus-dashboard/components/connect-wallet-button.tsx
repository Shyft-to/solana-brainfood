import dynamic from "next/dynamic"
import { cn } from "@/utils/cn"
import { buttonVariants } from "./ui/button"

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

export default function ConnectWalletButton() {
  return <WalletMultiButtonDynamic className={cn(buttonVariants())} />
}
