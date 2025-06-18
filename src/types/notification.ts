
import type { LucideIcon } from 'lucide-react';

// Define a union type for valid icon names. This improves type safety.
export type NotificationIconName = 
  | "Bell" 
  | "FileText" 
  | "UserPlus"
  | "Settings2" // Example: if settings notifications are added
  | "CheckCircle" // Example: for success
  | "AlertCircle"; // Example: for warnings/errors

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  read: boolean;
  link?: string; // Optional link for navigation
  iconName?: NotificationIconName; // Store the name of the icon
  category?: 'system' | 'document' | 'user'; // Optional category
}

