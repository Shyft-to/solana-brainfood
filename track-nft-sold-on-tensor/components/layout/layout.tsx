import { PropsWithChildren } from "react"
import { Header } from "./header"

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <div className="flex min-h-full w-full">
        <main className="w-full pb-20 pt-24">
          <div className="w-full px-4 md:px-6 mx-auto max-w-screen-xl">{children}</div>
        </main>
      </div>
    </>
  )
}
