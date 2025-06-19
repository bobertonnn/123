
"use client";

import type { Contact } from "@/types/contact";

const CONTACTS_STORAGE_KEY = "userContacts";

// TODO: [DB Integration] Replace localStorage with API calls to your backend.
// This function should fetch contacts from your database via an API endpoint.
// Example: const response = await fetch('/api/contacts?userId=...); const data = await response.json(); return data;
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

// TODO: [DB Integration] Replace localStorage with API calls.
// This function is likely not needed if getContacts always fetches fresh data.
// If used for caching, ensure cache invalidation strategies.
export const saveContacts = (contacts: Contact[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
};

// TODO: [DB Integration] Replace localStorage logic with a POST request to your /api/contacts endpoint.
// The API should handle saving the contact to the database and return the created contact.
export const addContact = (newContactData: Omit<Contact, 'id'>): Contact => {
  // Current localStorage logic (for prototype)
  const contacts = getContacts();
  const newContact: Contact = {
    id: Date.now().toString(), 
    ...newContactData,
    avatar: newContactData.avatar || `https://placehold.co/40x40.png?text=${newContactData.name.substring(0,2).toUpperCase()}`
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;

  // Example API logic (for future):
  // const response = await fetch('/api/contacts', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(newContactData), // Ensure your API can handle user association
  // });
  // if (!response.ok) throw new Error('Failed to add contact');
  // const savedContact = await response.json();
  // return savedContact;
};

// TODO: [DB Integration] Replace localStorage with an API call to /api/contacts/[id].
export const getContactById = (id: string): Contact | null => {
  // Current localStorage logic (for prototype)
  const contacts = getContacts();
  return contacts.find(contact => contact.id === id) || null;

  // Example API logic (for future):
  // const response = await fetch(`/api/contacts/${id}`);
  // if (!response.ok) return null;
  // const contact = await response.json();
  // return contact;
};

// TODO: [DB Integration] Replace localStorage with a PUT request to /api/contacts/[id].
export const updateContact = (updatedContact: Contact): Contact | null => {
  // Current localStorage logic (for prototype)
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

  // Example API logic (for future):
  // const response = await fetch(`/api/contacts/${updatedContact.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updatedContact),
  // });
  // if (!response.ok) throw new Error('Failed to update contact');
  // const result = await response.json();
  // return result;
};

// TODO: [DB Integration] Replace localStorage with a DELETE request to /api/contacts/[id].
export const deleteContact = (id: string): boolean => {
  // Current localStorage logic (for prototype)
  let contacts = getContacts();
  const initialLength = contacts.length;
  contacts = contacts.filter(contact => contact.id !== id);
  if (contacts.length < initialLength) {
    saveContacts(contacts);
    return true;
  }
  return false;

  // Example API logic (for future):
  // const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  // return response.ok;
};
