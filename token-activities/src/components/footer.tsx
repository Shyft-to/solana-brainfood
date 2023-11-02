import IconButton from "@/components/ui/icon-button";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import { SiteConfig } from "@/config/site";
import { DiscordIcon, MediumIcon, TelegramIcon } from "./ui/icons";

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="container flex flex-col gap-4 mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="flex flex-col gap-6 md:col-span-3 lg:md:col-span-4">
            <a href="/">
              <Image alt="logo" height={32} width={139} src="assets/logo.svg" />
            </a>
            <p className="text-xs">
              Get in touch with our discord community and keep up with the
              latest feature releases.
              <br /> Get help from our developers who are always here to help
              you take off.
            </p>
            <div className="flex gap-4">
              <IconButton
                className="shrink-0"
                as="a"
                label="Github"
                target="_blank"
                href={SiteConfig.urls.github}
              >
                <GithubIcon />
              </IconButton>
              <IconButton
                className="shrink-0"
                as="a"
                target="_blank"
                label="Twitter"
                href={SiteConfig.urls.twitter}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                className="shrink-0"
                as="a"
                target="_blank"
                label="Linkedin"
                href={SiteConfig.urls.linkedin}
              >
                <LinkedinIcon />
              </IconButton>
              <IconButton
                className="shrink-0"
                as="a"
                target="_blank"
                label="Dicord"
                href={SiteConfig.urls.discord}
              >
                <DiscordIcon className="w-8 h-8" />
              </IconButton>
              <IconButton
                className="shrink-0"
                as="a"
                target="_blank"
                label="Telegram"
                href={SiteConfig.urls.telegram}
              >
                <TelegramIcon className="w-8 h-8" />
              </IconButton>
              <IconButton
                className="shrink-0"
                as="a"
                target="_blank"
                label="Medium"
                href={SiteConfig.urls.medium}
              >
                <MediumIcon className="w-8 h-8" />
              </IconButton>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Products</h3>
            <ul className="space-y-2">
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.nftDocument}
                  target="_blank"
                  className="hover:text-brand"
                >
                  NFT APIs
                </a>
              </li>
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.marketplaceDocument}
                  target="_blank"
                  className="hover:text-brand"
                >
                  Marketplace APIs
                </a>
              </li>
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.tokenDocument}
                  target="_blank"
                  className="hover:text-brand"
                >
                  Token APIs
                </a>
              </li>
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.walletDocument}
                  target="_blank"
                  className="hover:text-brand"
                >
                  Wallet APIs
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">For Developers</h3>
            <ul className="space-y-2">
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.docs}
                  className="hover:text-brand"
                  target="_blank"
                >
                  Documentation
                </a>
              </li>
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.discord}
                  target="_blank"
                  className="hover:text-brand"
                >
                  Join Discord
                </a>
              </li>
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.medium}
                  target="_blank"
                  className="hover:text-brand"
                >
                  Blogs
                </a>
              </li>
              <li className="text-sm">
                <a
                  href={SiteConfig.urls.twitter}
                  target="_blank"
                  className="hover:text-brand"
                >
                  Announcements
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <a
            className="text-sm hover:text-brand"
            href={`mailto:${SiteConfig.urls.contectEmail}`}
          >
            Contact: {SiteConfig.urls.contectEmail}
          </a>
          <div className="flex gap-1">
            <a
              className="text-sm hover:text-brand"
              href={SiteConfig.urls.termsAndConditions}
              target="_blank"
            >
              Terms &amp; Conditions
            </a>{" "}
            |
            <a
              className="text-sm hover:text-brand"
              href={SiteConfig.urls.privacyAndPolicy}
              target="_blank"
            >
              {" "}
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
