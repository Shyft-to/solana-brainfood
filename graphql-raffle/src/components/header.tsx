"use client";

import Image from "next/image";
import Button from "@/components/ui/button";
import { SiteConfig } from "@/config/site";

export default function Header() {
  return (
    <header className="bg-black">
      <div className="container flex items-center justify-between mx-auto h-16 px-4 md:px-8">
        <a href="/">
          <Image alt="logo" height={32} width={139} src="assets/logo.svg" />
        </a>
        <div className="flex gap-4">
          <a
            href={SiteConfig.urls.getApiKey}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Get API Key</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
