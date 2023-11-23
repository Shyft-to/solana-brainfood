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
    name: "Recent added",
    field: "startTimestamp",
    direction: "desc",
  },
  {
    name: "Price: High-Low",
    field: "ticketPrice",
    direction: "desc",
  },
  {
    name: "Price: Low-High",
    field: "ticketPrice",
    direction: "asc",
  },
];

type SortByProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export const SortBy = ({ value, onValueChange }: SortByProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full min-w-[200px]">
        <SelectValue placeholder="Sort by:" />
      </SelectTrigger>
      <SelectContent sideOffset={4}>
        {sortByOptions.map((item) => (
          <SelectItem key={item.name} value={`${item.field}-${item.direction}`}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
