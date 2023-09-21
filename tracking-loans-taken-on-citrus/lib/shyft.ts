import { Network, ShyftSdk } from "@shyft-to/js"

const shyftClient = new ShyftSdk({ apiKey: process.env.NEXT_PUBLIC_SHYFT_API_KEY!, network: Network.Mainnet })

export default shyftClient
