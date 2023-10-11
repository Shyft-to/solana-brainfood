import cx from "classnames";
import { twMerge } from "tailwind-merge";

export default function cn(...inputs: cx.ArgumentArray) {
  return twMerge(cx(inputs));
}
