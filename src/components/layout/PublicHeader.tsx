
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Logo, GradientBirdIcon } from '@/components/icons/Logo';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Settings, User as UserIcon, LogOut, Home } from 'lucide-react';

const publicNavLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const localName = typeof window !== 'undefined' ? localStorage.getItem("userFullName") : null;
        const localAvatar = typeof window !== 'undefined' ? localStorage.getItem("userAvatarUrl") : null;
        setUserName(localName || user.displayName || "User");
        setUserAvatar(localAvatar || user.photoURL);
      } else {
        setUserName(null);
        setUserAvatar(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userUID');
        localStorage.removeItem('userFullName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userSignature');
        localStorage.removeItem('userJoinDate');
        localStorage.removeItem('userAvatarUrl');
        localStorage.removeItem('userTag');
        localStorage.removeItem('userPhoneNumber');
        localStorage.removeItem('userCompanyName');
        localStorage.removeItem('userContacts');
        localStorage.removeItem('userSiteNotifications');
        localStorage.removeItem('uploadedDocuments');
        localStorage.removeItem('userSubscription');
        localStorage.removeItem('userBillingHistory');
        localStorage.removeItem('onboardingPromptDismissed');
      }
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/'); 
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
      });
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          {isLoadingAuth ? (
            <div className="flex items-center space-x-3">
               <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
               <div className="h-9 w-28 bg-muted rounded-md animate-pulse"></div>
            </div>
          ) : currentUser ? (
            <>
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userAvatar || undefined} alt={userName || "User"} data-ai-hint="user avatar" />
                       <AvatarFallback>
                         <GradientBirdIcon className="h-5 w-5 text-primary" />
                       </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="sm:hidden">
                      <Link href="/dashboard"><Home className="mr-2 h-4 w-4" />Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" />Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button className="btn-cta-primary-emerald" asChild>
                <Link href="/auth/signup">
                  <span>Sign Up Free</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
