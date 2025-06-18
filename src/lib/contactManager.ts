
"use client";

import type { Contact } from "@/types/contact";

const CONTACTS_STORAGE_KEY = "userContacts";

// Initialize with a few mock contacts if storage is empty
const initializeMockContacts = (): Contact[] => {
  return [
    { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', company: 'Wonderland Inc.', phone: '123-456-7890', avatar: 'https://placehold.co/40x40.png?text=AW' },
    { id: '2', name: 'Bob The Builder', email: 'bob@example.com', company: 'Builders Co.', phone: '234-567-8901', avatar: 'https://placehold.co/40x40.png?text=BB' },
    { id: '3', name: 'Charlie Chaplin', email: 'charlie@example.com', company: 'Comedy Films', phone: '345-678-9012', avatar: 'https://placehold.co/40x40.png?text=CC' },
  ];
};

export const getContacts = (): Contact[] => {
  if (typeof window === 'undefined') return [];
  const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (storedContacts) {
    try {
      const parsedContacts = JSON.parse(storedContacts);
      // Basic validation: check if it's an array
      return Array.isArray(parsedContacts) ? parsedContacts : initializeMockContacts();
    } catch (e) {
      console.error("Error parsing contacts from localStorage, initializing with mocks:", e);
      return initializeMockContacts(); // Fallback to mocks if parsing fails
    }
  } else {
    // No contacts in storage, initialize with mocks and save
    const mockContacts = initializeMockContacts();
    saveContacts(mockContacts);
    return mockContacts;
  }
};

export const saveContacts = (contacts: Contact[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
};

export const addContact = (newContactData: Omit<Contact, 'id'>): Contact => {
  const contacts = getContacts();
  const newContact: Contact = {
    id: Date.now().toString(), // Simple unique ID generation
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
