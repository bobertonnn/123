
"use client";

import { type Notification, type NotificationIconName } from "@/types/notification";

const NOTIFICATIONS_STORAGE_KEY = "userSiteNotifications";

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// TODO: [DB Integration] Replace localStorage with API calls to your backend.
// This function should fetch notifications from your database via an API endpoint.
// Example: const response = await fetch('/api/notifications?userId=...'); const data = await response.json(); return data;
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

// TODO: [DB Integration] Replace localStorage with API calls.
// This function is likely not needed if getNotifications always fetches fresh data.
// If used for caching, ensure cache invalidation strategies.
export const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated')); // Keep for local UI updates if needed
  }
};

// TODO: [DB Integration] Replace localStorage logic with a POST request to your /api/notifications endpoint.
// The API should handle saving the notification to the database and return the created notification.
export const addNotification = (newNotificationData: Omit<Notification, 'id' | 'read'>): Notification => {
  // Current localStorage logic (for prototype)
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: generateId(),
    read: false,
    timestamp: new Date().toISOString(),
    ...newNotificationData,
  };
  const updatedNotifications = [newNotification, ...notifications].slice(0, 50); // Keep only last 50
  saveNotifications(updatedNotifications);
  
  return newNotification;

  // Example API logic (for future):
  // const response = await fetch('/api/notifications', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...newNotificationData, timestamp: new Date().toISOString(), read: false, userId: '...' }),
  // });
  // if (!response.ok) throw new Error('Failed to add notification');
  // const savedNotification = await response.json();
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  // return savedNotification;
};

// TODO: [DB Integration] Replace localStorage with a PUT request to /api/notifications/[id]/read.
export const markNotificationAsRead = (id: string): void => {
  // Current localStorage logic (for prototype)
  let notifications = getNotifications();
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(notifications);

  // Example API logic (for future):
  // await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// TODO: [DB Integration] Replace localStorage with a PUT request to /api/notifications/mark-all-read.
export const markAllNotificationsAsRead = (): void => {
  // Current localStorage logic (for prototype)
  let notifications = getNotifications();
  notifications = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(notifications);

  // Example API logic (for future):
  // await fetch(`/api/notifications/mark-all-read`, { method: 'PUT' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// TODO: [DB Integration] Replace localStorage with a DELETE request to /api/notifications/[id].
export const deleteNotificationById = (id: string): void => {
  // Current localStorage logic (for prototype)
  let notifications = getNotifications();
  notifications = notifications.filter(n => n.id !== id);
  saveNotifications(notifications);

  // Example API logic (for future):
  // await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// TODO: [DB Integration] Replace localStorage with a DELETE request to /api/notifications/clear-all.
export const clearAllNotifications = (): void => {
  // Current localStorage logic (for prototype)
  saveNotifications([]);

  // Example API logic (for future):
  // await fetch(`/api/notifications/clear-all`, { method: 'DELETE' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};
