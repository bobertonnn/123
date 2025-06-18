import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => {
  if (!name || name.trim() === "") return ".."; // Handle empty or whitespace-only names
  const words = name.trim().split(/\s+/); // Split by any whitespace

  if (words.length === 1) {
    // One word: first two letters. If only one letter, just that one.
    return words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 2) {
    // Two words: first letter of each.
    return (words[0][0] + words[1][0]).toUpperCase();
  } else { // Three or more words
    // First letter of the first three words.
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
};
