
"use client";

import { Button, buttonVariants } from "@/components/ui/button"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Users, Search, MoreHorizontal, Edit, Trash2, Loader2, Tag, UserPlus, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Contact } from "@/types/contact";
import { getContacts, deleteContact as deleteContactFromStorage } from "@/lib/contactManager";
import { useToast } from "@/hooks/use-toast";
import { addNotification } from "@/lib/notificationManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added AlertDialogTrigger back
} from "@/components/ui/alert-dialog";
import { getInitials } from "@/lib/utils";

const simulatedOtherUsers = [
  { id: 'sim1', name: 'Demo User One', email: 'demo1@example.com', tag: 'DemoUser#0001', avatar: 'https://placehold.co/40x40.png?text=D1' },
  { id: 'sim2', name: 'Test User Two', email: 'test2@example.com', tag: 'TestUser#0002', avatar: 'https://placehold.co/40x40.png?text=T2' },
  { id: 'sim3', name: 'Sample User Three', email: 'sample3@example.com', tag: 'Sample#0003', avatar: 'https://placehold.co/40x40.png?text=S3' },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTagInput, setUserTagInput] = useState("");
  const [currentUserTag, setCurrentUserTag] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const loadedContacts = getContacts();
    setContacts(loadedContacts);
    const storedTag = localStorage.getItem("userTag");
    setCurrentUserTag(storedTag);
    setIsLoading(false);
  }, []);

  const handleDeleteContact = (contactId: string) => {
    const success = deleteContactFromStorage(contactId);
    if (success) {
      setContacts(prevContacts => prevContacts.filter(c => c.id !== contactId));
      toast({
        title: "Contact Deleted",
        description: "The contact has been successfully removed.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the contact.",
      });
    }
  };

  const handleSendFriendRequest = () => {
    if (!userTagInput.trim()) {
      toast({ variant: "destructive", title: "Empty Tag", description: "Please enter a user tag." });
      return;
    }
    if (userTagInput.trim() === currentUserTag) {
      toast({ variant: "destructive", title: "Cannot Add Self", description: "You cannot send a friend request to yourself." });
      return;
    }

    const matchedSimulatedUser = simulatedOtherUsers.find(user => user.tag === userTagInput.trim());

    if (matchedSimulatedUser) {
      addNotification({
        title: "Friend Request Sent",
        description: `Your friend request to ${matchedSimulatedUser.name} (${matchedSimulatedUser.tag}) has been sent.`,
        iconName: "UserPlus",
        category: "user",
        link: "/contacts",
      });
      toast({
        title: "Request Sent!",
        description: `Friend request sent to ${matchedSimulatedUser.name}. (This is a simulation)`,
      });
      setUserTagInput(""); // Clear input after sending
    } else {
      toast({
        variant: "destructive",
        title: "User Not Found",
        description: `No user found with the tag "${userTagInput.trim()}". Please check the tag and try again. (Note: This is a simulated user directory for demo purposes).`,
        duration: 7000,
      });
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Contacts</h1>
        <Button asChild className="btn-gradient-hover">
          <Link href="/contacts/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Add New Contact Manually</span>
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center"><Tag className="mr-2 h-5 w-5 text-primary"/>Add Contact by Tag</CardTitle>
          <CardDescription>Enter a user's unique tag (e.g., UserName#1234) to send them a friend request.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-grow w-full sm:w-auto">
            <Label htmlFor="userTagInput">User Tag</Label>
            <Input 
              id="userTagInput"
              placeholder="e.g., DemoUser#0001" 
              value={userTagInput}
              onChange={(e) => setUserTagInput(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSendFriendRequest} className="w-full sm:w-auto btn-gradient-hover">
            <Send className="mr-2 h-4 w-4" /> Send Friend Request
          </Button>
        </CardContent>
      </Card>


      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-headline">Your Contact List</CardTitle>
            <CardDescription>Manage your saved contacts.</CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.company || "N/A"}</TableCell>
                    <TableCell>{contact.phone || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/contacts/${contact.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the contact "{contact.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteContact(contact.id)} className={buttonVariants({variant: "destructive"})}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold">
                {contacts.length > 0 ? "No Contacts Match Search" : "No Contacts Yet"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {contacts.length > 0 
                  ? "Try a different search term or clear your search." 
                  : "Add contacts manually or send a friend request using their tag."
                }
              </p>
              {contacts.length === 0 && !searchTerm && (
                <Button className="mt-6 btn-gradient-hover" asChild>
                  <Link href="/contacts/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> <span>Add Your First Contact</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
