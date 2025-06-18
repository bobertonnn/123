
"use client";

import { type Notification, type NotificationIconName } from "@/types/notification";

const NOTIFICATIONS_STORAGE_KEY = "userSiteNotifications";

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

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

export const addNotification = (newNotificationData: Omit<Notification, 'id' | 'read'>): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: generateId(),
    read: false,
    timestamp: new Date().toISOString(), // Ensure timestamp is set here if not passed
    ...newNotificationData,
  };
  const updatedNotifications = [newNotification, ...notifications].slice(0, 50); // Keep max 50 notifications
  saveNotifications(updatedNotifications);
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
  return newNotification;
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
