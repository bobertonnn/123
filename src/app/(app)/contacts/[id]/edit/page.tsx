
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit3, Save, X, Loader2, AlertTriangle } from "lucide-react";
import { getContactById, updateContact } from "@/lib/contactManager";
import { useToast } from "@/hooks/use-toast";
import type { Contact } from "@/types/contact";

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  const { toast } = useToast();

  const [contact, setContact] = useState<Contact | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contactId) {
      setIsLoading(true);
      const loadedContact = getContactById(contactId);
      if (loadedContact) {
        setContact(loadedContact);
        setName(loadedContact.name);
        setEmail(loadedContact.email);
        setCompany(loadedContact.company || "");
        setPhone(loadedContact.phone || "");
        setAvatar(loadedContact.avatar || "");
      } else {
        setError("Contact not found.");
      }
      setIsLoading(false);
    } else {
        setError("No contact ID provided.");
        setIsLoading(false);
    }
  }, [contactId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) {
      toast({ variant: "destructive", title: "Error", description: "Contact data is missing." });
      return;
    }
    if (!name || !email) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and Email are required fields.",
      });
      return;
    }

    const updatedContactData: Contact = {
      ...contact,
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      avatar: avatar || undefined, // Let contactManager handle default if blank
    };

    const result = updateContact(updatedContactData);
    if (result) {
      toast({
        title: "Contact Updated",
        description: `${name} has been successfully updated.`,
      });
      router.push("/contacts");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contact.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading contact details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/contacts')} className="mt-6">
          Back to Contacts
        </Button>
      </div>
    );
  }

  if (!contact) {
    // Should be caught by error state, but as a fallback
    return <div className="text-center p-4">Contact could not be loaded.</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/contacts">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Contacts</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-headline flex items-center">
          <Edit3 className="mr-3 h-7 w-7 text-primary" /> Edit Contact
        </h1>
         <div className="w-9 h-9"></div> {/* Spacer */}
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle>Update Contact Information</CardTitle>
          <CardDescription>Modify the details for {contact.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            {/*
            <div>
              <Label htmlFor="avatar">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="e.g., https://placehold.co/40x40.png"
                className="mt-1"
              />
               <p className="text-xs text-muted-foreground mt-1">If left blank, initials will be used.</p>
            </div>
            */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/contacts">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Link>
              </Button>
              <Button type="submit" className="btn-gradient-hover">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
