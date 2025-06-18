
"use client";

import { type Notification, type NotificationIconName } from "@/types/notification";
// We don't import Lucide icons here anymore for storage, AppHeader will handle mapping names to components.

const NOTIFICATIONS_STORAGE_KEY = "userSiteNotifications";

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// Mock notifications to add if the store is empty
// Now using iconName (string) instead of icon (LucideIcon component)
const defaultMockNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
  {
    title: "Welcome to DocuSigner!",
    description: "Explore your dashboard and start managing documents efficiently.",
    iconName: "Bell",
    link: "/dashboard",
    category: "system",
  },
  {
    title: "Document 'Q3 Report' Signed",
    description: "Alex Johnson has signed the 'Q3 Sales Report'.",
    iconName: "FileText",
    link: "/documents/1", // Example link
    category: "document",
  },
  {
    title: "New Contact Added",
    description: "You've successfully added 'Maria Garcia' to your contacts.",
    iconName: "UserPlus",
    link: "/contacts",
    category: "user",
  },
  {
    title: "Action Required: Sign 'NDA-ProjectX'",
    description: "Your signature is requested on 'NDA-ProjectX'. Please review and sign.",
    iconName: "FileText", // Changed from "AlertCircle" to a more common one for now
    link: "/documents/pending",
    category: "document",
  }
];

export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  try {
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error parsing notifications from localStorage", e);
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
};

export const addNotification = (newNotificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    read: false,
    ...newNotificationData, // newNotificationData should contain iconName as string
  };
  const updatedNotifications = [newNotification, ...notifications].slice(0, 50); // Keep max 50 notifications
  saveNotifications(updatedNotifications);
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
  return newNotification;
};

export const addMockNotifications = (): void => {
  const existingNotifications = getNotifications();
  if (existingNotifications.length > 0) return; 

  const mocksToAdd: Notification[] = defaultMockNotifications.map(mock => ({
    ...mock,
    id: generateId(),
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(), 
    read: Math.random() > 0.7, 
  }));
  saveNotifications(mocksToAdd);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

export const markNotificationAsRead = (id: string): void => {
  let notifications = getNotifications();
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(notifications);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

export const markAllNotificationsAsRead = (): void => {
  let notifications = getNotifications();
  notifications = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(notifications);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

export const deleteNotificationById = (id: string): void => {
  let notifications = getNotifications();
  notifications = notifications.filter(n => n.id !== id);
  saveNotifications(notifications);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

export const clearAllNotifications = (): void => {
  saveNotifications([]);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};
