import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 md:px-8 py-24 container mx-auto">
      <h3 className="text-3xl font-bold mb-10">Shyft Callbacks</h3>
      <Link className="underline mb-3" href="/transaction-callbacks">
        Transaction Callbacks
      </Link>
      <Link className="underline" href="/account-callbacks">
        Account Callbacks
      </Link>
    </main>
  );
}
