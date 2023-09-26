import { useEffect, useState } from "react"
import { cn } from "@/utils/cn"
import { GithubIcon } from "lucide-react"

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
        "fixed right-0 top-0 z-[40] h-16 w-full backdrop-blur-sm transition-[height] duration-200 ease-in-out",
        { "lg:h-[60px]": small }
      )}
    >
      <div className="relative flex h-full min-h-[56px] items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <div className="flex grow items-center justify-end gap-2">
          <a href="">
            <GithubIcon />
          </a>
        </div>
      </div>
    </header>
  )
}
