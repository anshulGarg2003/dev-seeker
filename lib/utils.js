import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function splitTags(tagList) {
  if (!tagList || tagList.trim() === "") return [];
  return tagList.split(",").map((lang) => lang.trim()).filter(Boolean);
}
