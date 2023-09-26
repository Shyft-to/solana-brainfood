import type { AppProps } from "next/app"
import { DefaultSeo } from "next-seo"
import type { FC } from "react"
import React from "react"
import { Layout } from "@/components/layout"
import { siteConfig } from "@/config/site"

// Use require instead of import since order matters
require("../styles/globals.css")

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo
        title={siteConfig.name}
        openGraph={{
          type: "website",
          locale: "en_EN",
          description: siteConfig.description,
          site_name: siteConfig.name,
          title: siteConfig.name,
        }}
        description={siteConfig.description}
      />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default App
