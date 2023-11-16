import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import { SiteConfig } from "@/config/site";
import { ApolloWrapper } from './apollo-wrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SiteConfig.name,
  description: SiteConfig.description,
  openGraph: {
    images: [
      {
        url: "https://shyft.to/website_cover.jpg",
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <>
            <Header />
            {children}
            <Footer />
          </>
        </ApolloWrapper>
      </body>
    </html>
  );
}
