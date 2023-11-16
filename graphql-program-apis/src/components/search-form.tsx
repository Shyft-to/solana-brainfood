"use client";

import Button from "./ui/button";

export default function SearchForm({
  value,
  setValue,
  onSearch,
  loading,
  sortBy,
  setSortBy,
}: {
  value: string;
  sortBy: string;
  loading?: boolean;
  setValue: (val: string) => void;
  setSortBy: (val: string) => void;
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSearch} className="w-full">
      <label
        htmlFor="name"
        className="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
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
            placeholder="Enter proposal name"
            required
            name="name"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>

        <select
          id="sort"
          className="w-[160px] bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="" selected>
            Sort by Draft At
          </option>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
      <div className="flex justify-center mt-4">
        <Button disabled={loading} type="submit">
          {loading ? "Searching" : "Search"}
        </Button>
      </div>
    </form>
  );
}
