
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
    Menu, Search, Bell, LayoutGrid, UploadCloud, FileText as FileTextIcon, 
    Users, Settings2, HelpCircle, ChevronDown, CheckCheck, MailWarning, Trash2,
    AlertCircle
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn, getInitials } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { type Notification, type NotificationIconName } from "@/types/notification";
import { getNotifications, addMockNotifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications, deleteNotificationById } from "@/lib/notificationManager";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from 'lucide-react';

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/documents/upload", label: "Upload Document", icon: UploadCloud },
  { href: "/templates", label: "Templates", icon: FileTextIcon },
  { href: "/contacts", label: "Contacts", icon: Users },
];

const helpNavItems = [
 { href: "/settings", label: "Settings", icon: Settings2 },
 { href: "/help", label: "Help & Support", icon: HelpCircle },
];

const MobileNavLink = ({ href, label, icon: Icon, currentPathname }: { href: string; label: string; icon: React.ElementType, currentPathname: string }) => (
  <Button
    variant={currentPathname === href ? "secondary" : "ghost"}
    className="w-full justify-start text-base py-3" 
    asChild
  >
    <Link href={href}>
      <Icon className="mr-3 h-5 w-5" /> 
      {label}
    </Link>
  </Button>
);

const iconMap: Record<NotificationIconName, LucideIcon> = {
  Bell: Bell,
  FileText: FileTextIcon,
  UserPlus: Users, 
  Settings2: Settings2,
  CheckCircle: CheckCheck,
  AlertCircle: AlertCircle, 
};
const DefaultNotificationIcon = Bell;


export function AppHeader() {
  const currentPathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User"); 
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  const loadProfileData = () => {
    const storedName = localStorage.getItem("userFullName");
    const storedAvatar = localStorage.getItem("userAvatarUrl");
    setUserName(storedName || "User"); // Fallback to "User"
    setUserAvatarUrl(storedAvatar || undefined);
  };

  useEffect(() => {
    loadProfileData(); // Initial load
    refreshNotifications(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userSiteNotifications') {
        refreshNotifications();
      }
      if (event.key === 'userFullName' || event.key === 'userAvatarUrl') {
        loadProfileData();
      }
    };
    
    const handleCustomEvent = (event: Event) => {
      if ((event as CustomEvent).type === 'notificationsUpdated') {
        refreshNotifications();
      }
      if ((event as CustomEvent).type === 'profileUpdated') {
        loadProfileData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notificationsUpdated', handleCustomEvent);
    window.addEventListener('profileUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleCustomEvent);
      window.removeEventListener('profileUpdated', handleCustomEvent);
    };
  }, []);


  const refreshNotifications = () => {
    let currentNotifications = getNotifications();
    if (currentNotifications.length === 0 && typeof window !== 'undefined' && !localStorage.getItem('mockNotificationsAdded')) {
      addMockNotifications(); 
      localStorage.setItem('mockNotificationsAdded', 'true'); 
      currentNotifications = getNotifications();
    }
    setNotifications(currentNotifications.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()));
  };

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    refreshNotifications(); 
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    refreshNotifications();
  };
  
  const handleClearAllNotifications = () => {
    clearAllNotifications();
    refreshNotifications();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="md:hidden w-[280px] p-0">
            <nav className="grid text-lg font-medium">
              <div className="flex h-16 items-center border-b px-6 mb-2">
                <Link href="/">
                  <Logo />
                </Link>
              </div>
              <div className="flex-1 py-2 px-2 space-y-1">
                {mainNavItems.map((item) => <MobileNavLink key={item.href} {...item} currentPathname={currentPathname} />)}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="py-3 px-3 hover:bg-accent hover:no-underline rounded-md text-base font-medium [&[data-state=open]>svg]:text-primary">
                        <div className="flex items-center">
                            <FileTextIcon className="mr-3 h-5 w-5"/> My Documents
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pt-1 pb-0">
                        <MobileNavLink href="/documents/all" label="All Documents" icon={FileTextIcon} currentPathname={currentPathname} />
                        <MobileNavLink href="/documents/pending" label="Pending My Signature" icon={FileTextIcon} currentPathname={currentPathname} />
                        <MobileNavLink href="/documents/completed" label="Completed" icon={FileTextIcon} currentPathname={currentPathname} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {helpNavItems.map((item) => <MobileNavLink key={item.href} {...item} currentPathname={currentPathname} />)}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full rounded-lg bg-muted pl-8 md:w-[250px] lg:w-[320px] h-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full max-w-sm max-h-[70vh] flex flex-col">
            <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {notifications.length > 0 && (
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                        Mark all as read
                    </Button>
                )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled className="justify-center py-4">
                <MailWarning className="mr-2 h-5 w-5 text-muted-foreground"/> No new notifications
              </DropdownMenuItem>
            ) : (
              <ScrollArea className="flex-grow">
                {notifications.map((notification) => {
                  const IconComponent = typeof notification.iconName === 'string' && notification.iconName in iconMap 
                                      ? iconMap[notification.iconName] 
                                      : DefaultNotificationIcon;
                  return(
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                        "flex items-start gap-3 p-2 cursor-pointer data-[highlighted]:bg-accent/80", 
                        !notification.read && "bg-primary/5 hover:bg-primary/10"
                    )}
                    onSelect={(e) => { 
                        e.preventDefault(); 
                        handleMarkAsRead(notification.id);
                        // If notification.link, router.push(notification.link) or similar
                    }}
                  >
                    <div className={cn("mt-1 flex-shrink-0 h-5 w-5 flex items-center justify-center", !notification.read ? "text-primary" : "text-muted-foreground")}>
                        {typeof IconComponent === 'function' ? <IconComponent className="h-5 w-5" /> : null}
                    </div>
                    <div className="flex-grow min-w-0 overflow-hidden">
                      <p className={cn("font-medium text-sm truncate", !notification.read && "text-foreground")}>{notification.title}</p>
                      <p className={cn("text-xs text-muted-foreground break-words", !notification.read && "text-foreground/80")}>{notification.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {formatDistanceToNow(parseISO(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="ml-auto flex-shrink-0 p-1 h-auto text-xs text-primary hover:bg-primary/10"
                         onClick={(e) => {
                           e.stopPropagation();
                           handleMarkAsRead(notification.id);
                         }}
                       >
                         Mark Read
                       </Button>
                    )}
                  </DropdownMenuItem>
                )})}
              </ScrollArea>
            )}
            {notifications.length > 0 && (
                <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onSelect={(e) => {
                        e.preventDefault();
                        handleClearAllNotifications();
                    }}
                    disabled={notifications.length === 0}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 justify-center"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="justify-center" asChild>
                    <Link href="/notifications" className="w-full flex justify-center">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="overflow-hidden rounded-full w-9 h-9 md:w-10 md:h-10">
              <Avatar className="h-full w-full">
                  <AvatarImage src={userAvatarUrl || "https://placehold.co/40x40.png"} alt={userName} data-ai-hint="user avatar" />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
               <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
