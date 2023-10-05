"use client";

import { useRef, useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { findHolders } from "./action";

export default function Form() {
  const [error, setError] = useState<string | null>(null);
  const [holders, setHolders] = useState<string[]>([]);
  const form = useRef<HTMLFormElement>(null);

  return (
    <>
      <form
        action={async (formData) => {
          setError(null);
          setHolders([""]);
          const collection = formData.get("collection");
          if (
            typeof collection !== "string" ||
            collection.trim().length === 0
          ) {
            setError("collection cannot be empty");
            return;
          }
          const { success, error, data } = await findHolders(collection);
          if (success) {
            setHolders(data ?? []);
          } else {
            setError(error);
          }
        }}
        ref={form}
        className="max-w-lg w-full text-center"
      >
        <input
          type="text"
          id="collection"
          name="collection"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Collection address"
          required
        />
        {error && (
          <p className="text-left text-sm font-medium text-red-500 mt-2">
            {error}
          </p>
        )}
        <SubmitButton />
        <HolderList holders={holders} />
      </form>
    </>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-6 flex gap-1 items-center px-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      disabled={pending}
    >
      Find{" "}
      {pending && (
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="white"
          />
        </svg>
      )}
    </button>
  );
};

const HolderList = ({ holders }: { holders: string[] }) => {
  const { pending } = useFormStatus();

  if (pending) return <p>loading...</p>;

  return (
    <ul className="max-w-lg text-center w-full mt-10">
      {holders.length > 0 && (
        <div className="flex justify-end mb-6">
          <button
            className="flex gap-1 items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={(event) => {
              event.preventDefault();
              downloadCSV(["Wallets", ...holders].join("\n"));
            }}
          >
            Download CSV
          </button>
        </div>
      )}
      <div className="max-h-[500px] overflow-y-auto w-full">
        {holders.map((holder) => (
          <li className="py-2" key={holder}>
            {holder}
          </li>
        ))}
      </div>
    </ul>
  );
};

const downloadCSV = (data: string) => {
  const blob = new Blob([data], {
    type: "text/csv;charset=utf-8,",
  });
  console.log(data);
  const objUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", objUrl);
  link.setAttribute("download", `wallet-${Date.now()}.csv`);
  link.click();
};
