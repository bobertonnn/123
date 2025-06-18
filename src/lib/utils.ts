
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string' || name.trim() === "") {
    return ".."; // Consistent placeholder for invalid/missing names
  }

  const words = name.trim().split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) { // Handles names that were just spaces
    return "..";
  }

  if (words.length === 1) {
    const firstWord = words[0];
    if (firstWord.length === 1) {
      return (firstWord[0] + firstWord[0]).toUpperCase(); // "A" -> "AA"
    }
    return firstWord.substring(0, 2).toUpperCase(); // "User" -> "US", "Alex" -> "AL"
  } else if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase(); // "John Doe" -> "JD"
  } else { // 3 or more words
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase(); // "First Middle Last" -> "FML"
  }
};
