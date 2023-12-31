import BidTable from "@/components/table";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 md:px-8 py-24 container mx-auto">
      <h3 className="text-3xl font-bold">MagicEden Bid Tracker</h3>
      <BidTable />
    </main>
  );
}
