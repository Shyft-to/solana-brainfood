import Form from "./form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="text-4xl font-extrabold dark:text-white text-center mb-10">
        Find holders
      </h2>
      <Form />
    </main>
  );
}
