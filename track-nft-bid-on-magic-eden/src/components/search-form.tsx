"use client";

export default function SearchForm({
  value,
  setValue,
  onSearch,
}: {
  value: string;
  setValue: (val: string) => void;
  onSearch: VoidFunction;
}) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
          id="search"
          className="block w-full p-4 pl-10 text-sm text-slate-100 rounded-md shadow-sm bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Search collection"
          required
          name="collection"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          className="text-white absolute right-2.5 bottom-2.5 bg-brand hover:bg-brand/80 focus:ring-4 focus:outline-none focus:ring-brand font-medium rounded-lg text-sm px-4 py-2"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
