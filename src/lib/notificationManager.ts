
"use client";

import { type Notification, type NotificationIconName } from "@/types/notification";

const NOTIFICATIONS_STORAGE_KEY = "userSiteNotifications";

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// TODO: При переходе на MySQL, эта функция должна будет делать fetch-запрос к вашему API.
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

// TODO: При переходе на MySQL, эта функция должна будет делать fetch-запрос к вашему API (или будет не нужна, если getNotifications всегда фетчит свежие).
export const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  // В будущем, после успешного запроса к API, можно обновить локальный кэш или вызвать getNotifications.
};

// TODO: При переходе на MySQL, эта функция должна будет делать POST-запрос к вашему API.
export const addNotification = (newNotificationData: Omit<Notification, 'id' | 'read'>): Notification => {
  // Логика для localStorage (для прототипа)
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: generateId(),
    read: false,
    timestamp: new Date().toISOString(),
    ...newNotificationData,
  };
  const updatedNotifications = [newNotification, ...notifications].slice(0, 50);
  saveNotifications(updatedNotifications);
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
  return newNotification;

  // Примерная логика для API (в будущем):
  // const response = await fetch('/api/notifications', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...newNotificationData, timestamp: new Date().toISOString(), read: false }),
  // });
  // if (!response.ok) throw new Error('Failed to add notification');
  // const savedNotification = await response.json();
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  // return savedNotification;
};

// TODO: При переходе на MySQL, эта функция должна будет делать PUT-запрос к вашему API.
export const markNotificationAsRead = (id: string): void => {
  // Логика для localStorage (для прототипа)
  let notifications = getNotifications();
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(notifications);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }

  // Примерная логика для API (в будущем):
  // await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// TODO: При переходе на MySQL, эта функция должна будет делать PUT-запрос к вашему API.
export const markAllNotificationsAsRead = (): void => {
  // Логика для localStorage (для прототипа)
  let notifications = getNotifications();
  notifications = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(notifications);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
  // Примерная логика для API (в будущем):
  // await fetch(`/api/notifications/mark-all-read`, { method: 'PUT' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// TODO: При переходе на MySQL, эта функция должна будет делать DELETE-запрос к вашему API.
export const deleteNotificationById = (id: string): void => {
  // Логика для localStorage (для прототипа)
  let notifications = getNotifications();
  notifications = notifications.filter(n => n.id !== id);
  saveNotifications(notifications);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
  // Примерная логика для API (в будущем):
  // await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// TODO: При переходе на MySQL, эта функция должна будет делать DELETE-запрос к вашему API.
export const clearAllNotifications = (): void => {
  // Логика для localStorage (для прототипа)
  saveNotifications([]);
   if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
  // Примерная логика для API (в будущем):
  // await fetch(`/api/notifications/clear-all`, { method: 'DELETE' });
  // if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};
