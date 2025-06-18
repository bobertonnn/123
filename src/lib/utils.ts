import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => {
  if (!name || name.trim() === "") return "..";
  const words = name.trim().split(/\s+/); // Split by any whitespace

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else { // 3 or more words
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
};
