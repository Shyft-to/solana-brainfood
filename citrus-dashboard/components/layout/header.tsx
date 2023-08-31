import { MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/utils/cn"
import ConnectWalletButton from "../connect-wallet-button"
import { NavigationMobile } from "./nav-mobile"

export const Header = () => {
  const [small, setSmall] = useState(false)

  useEffect(() => {
    function handler() {
      setSmall(window.pageYOffset > 60)
    }

    window.addEventListener("scroll", handler)

    return () => {
      window.removeEventListener("scroll", handler)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-[40] h-16 w-full backdrop-blur-sm transition-[height] duration-200 ease-in-out lg:h-24 lg:w-[calc(100%-281px)]",
        { "lg:h-[60px]": small }
      )}
    >
      <div className="relative flex h-full min-h-[56px] items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <NavigationMobile
          trigger={
            <IconButton className="mr-2 lg:hidden" size="sm">
              <MenuIcon />
            </IconButton>
          }
        />
        <div className="flex grow items-center justify-end gap-2">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
