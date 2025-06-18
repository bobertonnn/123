
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

  // Prioritize first letter of first two words if available
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase(); // "John Doe" -> "JD"
  }
  
  // If only one word, take up to two letters
  if (words.length === 1) {
    const firstWord = words[0];
    if (firstWord.length === 1) {
      return (firstWord[0] + firstWord[0]).toUpperCase(); // "A" -> "AA"
    }
    return firstWord.substring(0, 2).toUpperCase(); // "User" -> "US", "Alex" -> "AL"
  }
  
  return ".."; // Default fallback if somehow conditions above aren't met
};
