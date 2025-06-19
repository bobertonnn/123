
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus, Save, X } from "lucide-react";
import { addContact } from "@/lib/contactManager";
import { useToast } from "@/hooks/use-toast";
import type { Contact } from "@/types/contact";

export default function AddNewContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(""); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Full Name and Email Address are required fields.",
        });
        return;
    }

    const newContactData: Omit<Contact, 'id'> = {
        name,
        email,
        company: company || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
    };
    
    addContact(newContactData);

    toast({
      title: "Contact Added",
      description: `${name} has been successfully added to your contacts.`,
    });
    router.push("/contacts");
  };

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
          <UserPlus className="mr-3 h-7 w-7 text-primary" /> Add New Contact
        </h1>
        <div className="w-9 h-9"></div> {/* Spacer */}
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Fill in the information for your new contact.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alice Wonderland"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., alice@example.com"
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
                placeholder="e.g., Wonderland Inc."
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
                placeholder="e.g., (123) 456-7890"
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
                <Save className="mr-2 h-4 w-4" /> Save Contact
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
