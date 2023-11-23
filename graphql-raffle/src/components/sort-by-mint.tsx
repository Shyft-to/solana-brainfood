"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const sortByOptions = [
  {
    name: "FNC",
    value: "71tMhTspdcJ6pCPxfJZ69zboYSypcK6fDujuK7xRoRPK",
  },
  {
    name: "Hay",
    value: "HAYsDsV8uQVJcrM3NMYrHZUvxoTSfhfns6yNxhPGZyiq",
  },
  {
    name: "JRaffle",
    value: "JRafsSWTp6KExEsYX8XixQ397D7KMgpa7PRaTvqgWUN",
  },
  {
    name: "SOL",
    value: "So11111111111111111111111111111111111111112",
  },
];

type SortByMintProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export const SortByMint = ({ value, onValueChange }: SortByMintProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="Token" />
      </SelectTrigger>
      <SelectContent sideOffset={4}>
        {sortByOptions.map((item) => (
          <SelectItem key={item.name} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
