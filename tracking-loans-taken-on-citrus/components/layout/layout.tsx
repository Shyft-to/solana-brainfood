import { PropsWithChildren } from "react"
import { Header } from "./header"
import { Navigation } from "./nav"

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <div className="flex min-h-full w-full">
        <Navigation />
        <main className="w-full py-[72px] lg:w-[calc(100vw-160px)] lg:grow lg:px-4 lg:py-[100px] bg-gray-500/8">
          <div className="w-full px-4 md:px-6 2xl:mx-auto 2xl:max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </>
  )
}
