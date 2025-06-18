
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
    Menu, Search, Bell, LayoutGrid, UploadCloud, FileText as FileTextIcon, 
    Users, Settings2, HelpCircle, ChevronDown, CheckCheck, MailWarning, Trash2,
    AlertCircle
} from "lucide-react";
import { Logo, GradientBirdIcon } from "@/components/icons/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { type Notification, type NotificationIconName } from "@/types/notification";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } from "@/lib/notificationManager";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Added useToast
import type { UserSubscription } from "@/app/(app)/settings/page"; // Assuming this type is available

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid, id: "dashboard" },
  { href: "/documents/upload", label: "Upload Document", icon: UploadCloud, id: "upload" },
  { href: "/templates", label: "Templates", icon: FileTextIcon, id: "templates" },
  { href: "/contacts", label: "Contacts", icon: Users, id: "contacts" },
];

const helpNavItems = [
 { href: "/settings", label: "Settings", icon: Settings2 },
 { href: "/help", label: "Help & Support", icon: HelpCircle },
];

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
  const router = useRouter(); // Added router
  const { toast } = useToast(); // Added toast
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null); // Added currentPlan

  const loadUserDataAndSubscription = () => {
    let storedName = localStorage.getItem("userFullName");
    if (storedName && storedName.trim() !== "") {
      setUserName(storedName.trim());
    } else {
      setUserName("User"); 
    }
    const storedAvatar = localStorage.getItem("userAvatarUrl");
    setUserAvatarUrl(storedAvatar && storedAvatar.trim() !== "" ? storedAvatar : undefined);

    const storedSubscription = localStorage.getItem("userSubscription");
    if (storedSubscription) {
      try {
        const parsedSubscription: UserSubscription = JSON.parse(storedSubscription);
        setCurrentPlan(parsedSubscription.planName);
      } catch (e) {
        console.error("Failed to parse subscription from localStorage in header", e);
        setCurrentPlan("Free Trial");
      }
    } else {
      setCurrentPlan("Free Trial");
    }
  };

  useEffect(() => {
    loadUserDataAndSubscription(); 
    refreshNotifications(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userSiteNotifications') {
        refreshNotifications();
      }
      if (event.key === 'userFullName' || event.key === 'userAvatarUrl' || event.key === 'userSubscription') {
        loadUserDataAndSubscription();
      }
    };
    
    const handleCustomEvent = (event: Event) => {
      if ((event as CustomEvent).type === 'notificationsUpdated') {
        refreshNotifications();
      }
      if ((event as CustomEvent).type === 'profileUpdated' || (event as CustomEvent).type === 'subscriptionUpdated') { // Assume subscriptionUpdated event exists if settings page dispatches it
        loadUserDataAndSubscription();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notificationsUpdated', handleCustomEvent);
    window.addEventListener('profileUpdated', handleCustomEvent);
    // window.addEventListener('subscriptionUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleCustomEvent);
      window.removeEventListener('profileUpdated', handleCustomEvent);
      // window.removeEventListener('subscriptionUpdated', handleCustomEvent);
    };
  }, []);

  const MobileNavLink = ({ href, label, icon: Icon, currentPathname, id }: { href: string; label: string; icon: React.ElementType, currentPathname: string, id?: string }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (id === "templates" && currentPlan === "Free Trial") {
        e.preventDefault();
        toast({
          title: "Premium Feature",
          description: "Templates are a premium feature. Please upgrade your plan to use them.",
          variant: "default",
        });
        // Optionally close the sheet if it's a SheetClose trigger, or handle sheet state
        const sheetCloseButton = (e.target as HTMLElement).closest('[cmdk-root]')?.parentElement?.querySelector('[cmdk-sheet-close]');
        if(sheetCloseButton instanceof HTMLElement) sheetCloseButton.click();

      } else {
        router.push(href);
      }
    };

    return (
    <Button
      variant={currentPathname === href ? "secondary" : "ghost"}
      className="w-full justify-start text-base py-3" 
      onClick={id === "templates" ? handleClick : undefined}
      asChild={id !== "templates"}
    >
       {id === "templates" ? ( 
        <span className="flex items-center w-full">
          <Icon className="mr-3 h-5 w-5" /> 
          {label}
        </span>
      ) : (
        <Link href={href}>
          <Icon className="mr-3 h-5 w-5" /> 
          {label}
        </Link>
      )}
    </Button>
    );
  };

  const refreshNotifications = () => {
    let currentNotifications = getNotifications();
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
                        if (notification.link) {
                            router.push(notification.link); 
                        }
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
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="overflow-hidden rounded-full w-9 h-9 md:w-10 md:h-10">
              <Avatar className="h-full w-full">
                {userAvatarUrl ? (
                  <AvatarImage src={userAvatarUrl} alt={userName} data-ai-hint="user avatar" />
                ) : (
                  <AvatarFallback className="bg-card border border-border flex items-center justify-center">
                     <GradientBirdIcon className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                )}
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
