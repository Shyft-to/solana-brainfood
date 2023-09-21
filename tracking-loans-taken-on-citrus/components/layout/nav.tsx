import { GithubIcon, TwitterIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Typography } from "@/components/ui/typography"
import { siteConfig } from "@/config/site"
import { cn } from "@/utils/cn"
import { IconButton } from "../ui/icon-button"

export const NavItems = [
  {
    text: "Citrus",
    href: "/",
  },
]

export const Navigation = () => {
  const { asPath } = useRouter()

  return (
    <nav className="hidden w-[280px] shrink-0 lg:block">
      <div className="fixed left-0 top-0 z-0 flex h-full w-[280px] flex-col overflow-y-auto border-r border-dashed border-r-gray-500/24">
        <div className="mb-4 px-5 py-6">
          <a href="/" className="font-bold">
            <img src="/assets/shyft-logo.svg" className="h-10 w-10 rounded-md" />
          </a>
        </div>
        <div className="flex h-96 flex-col">
          <ul className="relative px-4">
            {NavItems.map((item) => (
              <NavItem key={item.text} text={item.text} href={item.href} selected={asPath === item.href} />
            ))}
          </ul>
        </div>
        <div className="flex flex-1 flex-col items-center justify-end">
          <div className="flex items-center gap-4 p-6">
            <IconButton color="primary" as="a" href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
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
      </div>
    </nav>
  )
}

type NavItemProps = {
  text: string
  href: string
  selected?: boolean
  icon?: React.ReactNode
}

export const NavItem = ({ text, href, selected, icon }: NavItemProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "mb-2 flex h-12 cursor-pointer select-none items-center justify-start gap-2 rounded-lg py-2 pl-3 pr-4",
          { "bg-primary-500/8": selected },
          { "hover:bg-gray-500/8": !selected }
        )}
      >
        {icon && (
          <span
            className={cn("h-6 w-6 rounded-full", {
              "text-primary-500": selected,
              "text-gray-600": !selected,
            })}
          >
            {icon}
          </span>
        )}
        <Typography
          level="body4"
          className={cn("font-semibold", {
            "text-primary-500": selected,
            "text-gray-600": !selected,
          })}
        >
          {text}
        </Typography>
      </div>
    </Link>
  )
}
