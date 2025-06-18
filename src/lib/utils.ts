
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string' || name.trim() === "") {
    return "..";
  }

  const words = name.trim().split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) {
    return "..";
  }

  if (words.length === 1) {
    const firstWord = words[0];
    if (firstWord.length === 1) {
      return (firstWord[0] + firstWord[0]).toUpperCase(); // e.g., "A" -> "AA"
    }
    return firstWord.substring(0, 2).toUpperCase(); // e.g., "User" -> "US", "Ax" -> "AX"
  } else if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase(); // e.g., "John Doe" -> "JD"
  } else { // 3 or more words
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase(); // e.g., "First Middle Last" -> "FML"
  }
};
