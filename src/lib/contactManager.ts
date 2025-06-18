
"use client";

import type { Contact } from "@/types/contact";

const CONTACTS_STORAGE_KEY = "userContacts";

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
  return []; // No contacts in storage, return empty array
};

export const saveContacts = (contacts: Contact[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
};

export const addContact = (newContactData: Omit<Contact, 'id'>): Contact => {
  const contacts = getContacts();
  const newContact: Contact = {
    id: Date.now().toString(), 
    ...newContactData,
    avatar: newContactData.avatar || `https://placehold.co/40x40.png?text=${newContactData.name.substring(0,2).toUpperCase()}`
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

export const getContactById = (id: string): Contact | null => {
  const contacts = getContacts();
  return contacts.find(contact => contact.id === id) || null;
};

export const updateContact = (updatedContact: Contact): Contact | null => {
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
};

export const deleteContact = (id: string): boolean => {
  let contacts = getContacts();
  const initialLength = contacts.length;
  contacts = contacts.filter(contact => contact.id !== id);
  if (contacts.length < initialLength) {
    saveContacts(contacts);
    return true;
  }
  return false;
};
