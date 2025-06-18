
"use client";

import type { Contact } from "@/types/contact";

const CONTACTS_STORAGE_KEY = "userContacts";

// TODO: При переходе на MySQL, эта функция должна будет делать fetch-запрос к вашему API.
export const getContacts = (): Contact[] => {
  if (typeof window === 'undefined') return [];
  const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (storedContacts) {
    try {
      const parsedContacts = JSON.parse(storedContacts);
      return Array.isArray(parsedContacts) ? parsedContacts : [];
    } catch (e) {
      console.error("Error parsing contacts from localStorage:", e);
      return []; 
    }
  }
  return [];
};

// TODO: При переходе на MySQL, эта функция должна будет делать fetch-запрос к вашему API.
export const saveContacts = (contacts: Contact[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
   // В будущем, после успешного запроса к API, можно обновить локальный кэш или вызвать getContacts для обновления.
};

// TODO: При переходе на MySQL, эта функция должна будет делать POST-запрос к вашему API.
export const addContact = (newContactData: Omit<Contact, 'id'>): Contact => {
  // Логика для localStorage (для прототипа)
  const contacts = getContacts();
  const newContact: Contact = {
    id: Date.now().toString(), 
    ...newContactData,
    avatar: newContactData.avatar || `https://placehold.co/40x40.png?text=${newContactData.name.substring(0,2).toUpperCase()}`
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;

  // Примерная логика для API (в будущем):
  // const response = await fetch('/api/contacts', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(newContactData),
  // });
  // if (!response.ok) throw new Error('Failed to add contact');
  // const savedContact = await response.json();
  // return savedContact;
};

// TODO: При переходе на MySQL, эта функция должна будет делать fetch-запрос к вашему API.
export const getContactById = (id: string): Contact | null => {
  // Логика для localStorage (для прототипа)
  const contacts = getContacts();
  return contacts.find(contact => contact.id === id) || null;

  // Примерная логика для API (в будущем):
  // const response = await fetch(`/api/contacts/${id}`);
  // if (!response.ok) return null; // или throw new Error('Contact not found');
  // const contact = await response.json();
  // return contact;
};

// TODO: При переходе на MySQL, эта функция должна будет делать PUT-запрос к вашему API.
export const updateContact = (updatedContact: Contact): Contact | null => {
  // Логика для localStorage (для прототипа)
  let contacts = getContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === updatedContact.id);
  if (contactIndex > -1) {
    contacts[contactIndex] = {
        ...updatedContact,
        avatar: updatedContact.avatar || `https://placehold.co/40x40.png?text=${updatedContact.name.substring(0,2).toUpperCase()}`
    };
    saveContacts(contacts);
    return contacts[contactIndex];
  }
  return null;

  // Примерная логика для API (в будущем):
  // const response = await fetch(`/api/contacts/${updatedContact.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updatedContact),
  // });
  // if (!response.ok) throw new Error('Failed to update contact');
  // const result = await response.json();
  // return result;
};

// TODO: При переходе на MySQL, эта функция должна будет делать DELETE-запрос к вашему API.
export const deleteContact = (id: string): boolean => {
  // Логика для localStorage (для прототипа)
  let contacts = getContacts();
  const initialLength = contacts.length;
  contacts = contacts.filter(contact => contact.id !== id);
  if (contacts.length < initialLength) {
    saveContacts(contacts);
    return true;
  }
  return false;

  // Примерная логика для API (в будущем):
  // const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  // return response.ok;
};
