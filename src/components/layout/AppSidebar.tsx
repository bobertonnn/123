
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  UploadCloud,
  FileText,
  Settings2,
  Users,
  LogOut,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getInitials } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/documents/upload", label: "Upload Document", icon: UploadCloud },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/contacts", label: "Contacts", icon: Users },
];

const helpNavItems = [
 { href: "/settings", label: "Settings", icon: Settings2 },
 { href: "/help", label: "Help & Support", icon: HelpCircle },
];


export function AppSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  const loadProfileData = () => {
    const storedName = localStorage.getItem("userFullName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedAvatar = localStorage.getItem("userAvatarUrl");
    setUserName(storedName || "User"); // Fallback to "User"
    setUserEmail(storedEmail || "user@example.com"); // Fallback
    setUserAvatarUrl(storedAvatar || undefined);
  };

  useEffect(() => {
    loadProfileData(); // Initial load

    const handleProfileUpdate = () => {
      loadProfileData();
    }

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
        window.removeEventListener('profileUpdated', handleProfileUpdate);
    }
  }, []);

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
    <Button
      variant={pathname === href ? "secondary" : "ghost"}
      className="w-full justify-start"
      asChild
    >
      <Link href={href}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
  
  return (
    <div className="hidden border-r bg-card md:block h-full">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="py-2 px-3 hover:bg-accent hover:no-underline rounded-md text-sm font-medium [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4"/> My Documents
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-1 pb-0">
                    <NavLink href="/documents/all" label="All Documents" icon={FileText} />
                    <NavLink href="/documents/pending" label="Pending My Signature" icon={FileText} />
                    <NavLink href="/documents/completed" label="Completed" icon={FileText} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
            <nav className="grid items-start text-sm font-medium space-y-1 mb-4">
                {helpNavItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                ))}
            </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto py-2 px-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatarUrl || "https://placehold.co/40x40.png"} alt={userName} data-ai-hint="user avatar" />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium leading-none truncate max-w-[120px]">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate max-w-[120px]">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center w-full">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center w-full">
                 <Settings2 className="mr-2 h-4 w-4" />
                 <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                 <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
