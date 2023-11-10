import AccountCallbacks from "@/components/account-callback";

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 md:px-8 py-24 container mx-auto">
      <h3 className="text-3xl font-bold">Track Merkle Tree Account Update</h3>
      <AccountCallbacks />
    </main>
  );
}
