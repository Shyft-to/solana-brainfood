import { GithubIcon, TwitterIcon } from "lucide-react"
import { useRouter } from "next/router"
import { siteConfig } from "@/config/site"
import { IconButton } from "../ui/icon-button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { NavItem, NavItems } from "./nav"

export const NavigationMobile = ({ trigger }: { trigger: React.ReactNode }) => {
  const { asPath } = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="min-w-[360px]" size="sm">
        <SheetHeader>
          <a href="/" className="font-bold">
            <img src="/assets/shyft-logo.svg" className="h-10 w-10 rounded-md" />
          </a>
        </SheetHeader>
        <div className="gap-4 py-4">
          <ul>
            {NavItems.map((item) => (
              <NavItem
                key={item.text}
                text={item.text}
                href={item.href}
                selected={asPath === item.href}
                icon={item.icon}
              />
            ))}
          </ul>
        </div>
        <SheetFooter>
          <div className="flex flex-1 flex-col items-center justify-end">
            <div className="flex items-center gap-4 p-6">
              <IconButton
                color="primary"
                as="a"
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon />
              </IconButton>
              <IconButton
                color="primary"
                as="a"
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" as="a" href="https://shyft.to/" target="_blank" rel="noopener noreferrer">
                <img className="h-6 w-auto object-contain" src="/assets/shyft-logo.svg" />
              </IconButton>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
