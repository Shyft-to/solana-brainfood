"use client";

export default function SearchForm({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) {
  return (
    <form className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-slate-500 dark:text-slate-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="name"
          className="block w-full p-4 pl-10 text-sm text-slate-100 rounded-md shadow-sm bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Enter creator address"
          required
          name="name"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </form>
  );
}
