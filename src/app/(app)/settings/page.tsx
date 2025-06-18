
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Bell, CreditCard, Save, Edit3, XCircle, Loader2, Check, UploadCloud, Trash2, LogOut, DollarSign, ShoppingBag, FileClock, AlertTriangle, Package, Star, Zap, Tag, CalendarDays, Phone, Building } from "lucide-react";
import { SignatureCanvas } from "@/components/auth/SignatureCanvas";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { GradientBirdIcon } from "@/components/icons/Logo";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button as AlertDialogButton } from "@/components/ui/button"; // Alias to prevent conflict
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, addMonths, parseISO, isValid } from "date-fns";
import { buttonVariants } from "@/components/ui/button"; // Correct import for buttonVariants

type SaveStatus = "idle" | "saving" | "success" | "error";

const SIGNATURE_MAX_ROTATION_HOVER = 15;
const SIGNATURE_DRAG_SENSITIVITY = 0.2;
const signatureSpringConfig = { stiffness: 150, damping: 30, mass: 0.8 };

export interface UserSubscription {
  planName: string;
  planPrice: string;
  renewsOn?: string | null;
  paymentMethod?: {
    type: string;
    last4: string;
    expiry: string;
  } | null;
}

interface BillingHistoryEntry {
    id: string;
    date: string;
    description: string;
    amount: string;
    status: "Paid" | "Pending" | "Failed" | "Active";
    invoiceUrl?: string;
}

const availablePlans = [
    { id: "free", name: "Free Trial", price: "$0/month", priceNumeric: 0, features: ["Basic document signing", "Limited uploads", "Community support"], icon: Package },
    { id: "pro", name: "Pro Tier", price: "$15/month", priceNumeric: 15, features: ["Unlimited documents", "Advanced templates", "Priority support", "Team features (up to 5 users)"], icon: Star },
    { id: "business", name: "Business Tier", price: "$45/month", priceNumeric: 45, features: ["All Pro features", "Custom branding", "API access", "Dedicated account manager", "Unlimited users"], icon: Zap },
];

export default function SettingsPage() {
  const [userFullName, setUserFullName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userCompanyName, setUserCompanyName] = useState("");
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showUpdateSignatureArea, setShowUpdateSignatureArea] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const signatureContainerRef = useRef<HTMLDivElement>(null);
  const signatureImageRef = useRef<HTMLImageElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userJoinDate, setUserJoinDate] = useState<string | null>(null);
  const [userTag, setUserTag] = useState<string | null>(null);


  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>("idle");
  const [securitySaveStatus, setSecuritySaveStatus] = useState<SaveStatus>("idle");
  const [notificationSaveStatus, setNotificationSaveStatus] = useState<SaveStatus>("idle");


  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription>({
    planName: "Free Trial",
    planPrice: "$0/month",
    renewsOn: null,
    paymentMethod: null,
  });
  const [billingHistory, setBillingHistory] = useState<BillingHistoryEntry[]>([]);
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);
  const [selectedPlanInModal, setSelectedPlanInModal] = useState<string>(availablePlans[0].id);
  const [isUpdatePaymentDialogOpen, setIsUpdatePaymentDialogOpen] = useState(false);
  const [tempCardNumber, setTempCardNumber] = useState("");
  const [tempCardExpiry, setTempCardExpiry] = useState("");
  const [tempCardCvc, setTempCardCvc] = useState("");
  const [isCancelSubscriptionAlertOpen, setIsCancelSubscriptionAlertOpen] = useState(false);

  const [isDraggingSignature, setIsDraggingSignature] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialRotateX: 0, initialRotateY: 0 });


  const { toast } = useToast();

  const sigRotateX = useMotionValue(0);
  const sigRotateY = useMotionValue(0);
  const springSigRotateX = useSpring(sigRotateX, signatureSpringConfig);
  const springSigRotateY = useSpring(sigRotateY, signatureSpringConfig);

  const handleSignatureHoverMouseMove = useCallback((event: globalThis.MouseEvent) => {
    if (isDraggingSignature || !signatureContainerRef.current) return;
    const rect = signatureContainerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    const newRotateY = (mouseX / (rect.width / 2)) * SIGNATURE_MAX_ROTATION_HOVER;
    const newRotateX = -(mouseY / (rect.height / 2)) * SIGNATURE_MAX_ROTATION_HOVER;
    sigRotateX.set(newRotateX);
    sigRotateY.set(newRotateY);
  }, [isDraggingSignature, sigRotateX, sigRotateY]);

  const handleSignatureHoverMouseLeave = useCallback(() => {
    if (isDraggingSignature) return;
    sigRotateX.set(0);
    sigRotateY.set(0);
  }, [isDraggingSignature, sigRotateX, sigRotateY]);

  const handleSignaturePointerDown = useCallback((event: React.PointerEvent) => {
    if (!signatureImageRef.current || !signatureImageRef.current.contains(event.target as Node)) return;
    event.preventDefault();
    setIsDraggingSignature(true);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      initialRotateX: sigRotateX.get(),
      initialRotateY: sigRotateY.get(),
    };
    if (signatureImageRef.current) {
        signatureImageRef.current.style.cursor = 'grabbing';
    }
  }, [sigRotateX, sigRotateY]);

  useEffect(() => {
    const currentSignatureContainer = signatureContainerRef.current;
    if (currentSignatureContainer && userSignature && !showUpdateSignatureArea) {
      currentSignatureContainer.addEventListener('mousemove', handleSignatureHoverMouseMove);
      currentSignatureContainer.addEventListener('mouseleave', handleSignatureHoverMouseLeave);
    }

    const handleGlobalPointerMove = (event: PointerEvent) => {
      if (!isDraggingSignature) return;
      const dx = event.clientX - dragStartRef.current.x;
      const dy = event.clientY - dragStartRef.current.y;
      const newRotateX = dragStartRef.current.initialRotateX - dy * SIGNATURE_DRAG_SENSITIVITY;
      const newRotateY = dragStartRef.current.initialRotateY + dx * SIGNATURE_DRAG_SENSITIVITY;
      sigRotateX.set(newRotateX);
      sigRotateY.set(newRotateY);
    };

    const handleGlobalPointerUp = (event: PointerEvent) => {
      if (!isDraggingSignature) return;
      setIsDraggingSignature(false);
      if (signatureImageRef.current) {
        signatureImageRef.current.style.cursor = 'grab';
      }

      if (signatureContainerRef.current) {
        const rect = signatureContainerRef.current.getBoundingClientRect();
        const isMouseOverContainer =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!isMouseOverContainer) {
          handleSignatureHoverMouseLeave();
        } else {
           handleSignatureHoverMouseMove(event as unknown as globalThis.MouseEvent);
        }
      } else {
         handleSignatureHoverMouseLeave();
      }
    };

    if (isDraggingSignature) {
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }

    return () => {
      if (currentSignatureContainer) {
        currentSignatureContainer.removeEventListener('mousemove', handleSignatureHoverMouseMove);
        currentSignatureContainer.removeEventListener('mouseleave', handleSignatureHoverMouseLeave);
      }
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDraggingSignature, userSignature, showUpdateSignatureArea, handleSignatureHoverMouseMove, handleSignatureHoverMouseLeave, sigRotateX, sigRotateY]);


  const loadSubscriptionData = () => {
    const defaultFreePlan = availablePlans.find(p => p.id === 'free')!;
    let newBillingHistory: BillingHistoryEntry[] = [];
    let loadedSubscription: UserSubscription | null = null;

    if (typeof window !== 'undefined') {
      const storedSubscription = localStorage.getItem("userSubscription");
      if (storedSubscription) {
        try {
          const parsedSubscription = JSON.parse(storedSubscription) as UserSubscription;
          const planExists = availablePlans.find(p => p.name === parsedSubscription.planName);
          if (planExists) {
            loadedSubscription = {
              ...parsedSubscription,
              planPrice: planExists.price,
            };
          }
        } catch (e) {
          console.error("Failed to parse subscription from localStorage", e);
        }
      }

      if (!loadedSubscription) {
        loadedSubscription = { planName: defaultFreePlan.name, planPrice: defaultFreePlan.price, renewsOn: null, paymentMethod: null };
        localStorage.setItem("userSubscription", JSON.stringify(loadedSubscription));
      }
      setCurrentSubscription(loadedSubscription);
      setSelectedPlanInModal(availablePlans.find(p => p.name === loadedSubscription?.planName)?.id || defaultFreePlan.id);


      const storedHistory = localStorage.getItem("userBillingHistory");
      if (storedHistory) {
        try {
          newBillingHistory = JSON.parse(storedHistory);
        } catch (e) {
            console.error("Failed to parse billing history", e);
            newBillingHistory = [];
        }
      }

      const hasFreeTrialEntry = newBillingHistory.some(entry => entry.description === "Activated Free Trial");
      if (newBillingHistory.length === 0 || !hasFreeTrialEntry) {
        const joinDateStr = localStorage.getItem("userJoinDate") || new Date().toISOString();
        let joinDate = new Date(joinDateStr);
        if (!isValid(joinDate)) joinDate = new Date(); 

        const freeTrialEntry: BillingHistoryEntry = {
            id: Date.now().toString(),
            date: format(joinDate, "yyyy-MM-dd"),
            description: "Activated Free Trial",
            amount: defaultFreePlan.price.replace("/month", ""),
            status: "Active",
        };
        newBillingHistory = !hasFreeTrialEntry ? [freeTrialEntry, ...newBillingHistory.filter(e => e.description !== "Activated Free Trial")] : newBillingHistory;
        localStorage.setItem("userBillingHistory", JSON.stringify(newBillingHistory));
      }
      setBillingHistory(newBillingHistory);
    }
  };

  useEffect(() => {
    let storedFullName = localStorage.getItem("userFullName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPhoneNumber = localStorage.getItem("userPhoneNumber");
    const storedCompanyName = localStorage.getItem("userCompanyName");
    const storedSignature = localStorage.getItem("userSignature");
    const storedAvatar = localStorage.getItem("userAvatarUrl");
    let storedJoinDate = localStorage.getItem("userJoinDate");
    let storedUserTag = localStorage.getItem("userTag");

    if (storedFullName && storedFullName.trim() !== "") setUserFullName(storedFullName.trim());
    else setUserFullName("User");

    if (storedEmail && storedEmail.trim() !== "") setUserEmail(storedEmail.trim());
    else setUserEmail("user@example.com");

    if (storedPhoneNumber) setUserPhoneNumber(storedPhoneNumber);
    if (storedCompanyName) setUserCompanyName(storedCompanyName);

    if (storedSignature) {
        setUserSignature(storedSignature);
        setShowUpdateSignatureArea(false);
    } else {
        setShowUpdateSignatureArea(true);
    }
    if (storedAvatar && storedAvatar.trim() !== "") setUserAvatarUrl(storedAvatar);
    else {
      setUserAvatarUrl(undefined);
    }

    if (storedJoinDate) {
        let parsedJoinDate = new Date(storedJoinDate);
        if (!isValid(parsedJoinDate)) parsedJoinDate = new Date(); 
        setUserJoinDate(parsedJoinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    } else {
        const newJoinDate = new Date();
        localStorage.setItem("userJoinDate", newJoinDate.toISOString());
        setUserJoinDate(newJoinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        storedJoinDate = newJoinDate.toISOString(); 
    }

    if (storedUserTag) {
        setUserTag(storedUserTag);
    } else {
      const uid = localStorage.getItem("userUID");
      if (!storedFullName || storedFullName.trim() === "") storedFullName = "User"; 
      const namePart = storedFullName.split(" ")[0];
      const tagPart = uid ? uid.substring(0, 4) : Math.random().toString(36).substring(2,6); 
      const generatedTag = `${namePart}#${tagPart}`;
      setUserTag(generatedTag);
      localStorage.setItem("userTag", generatedTag);
    }

    loadSubscriptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSignatureSave = (dataUrl: string) => {
    setUserSignature(dataUrl);
    toast({
      title: "Signature Updated!",
      description: "Your new signature is ready. Save profile changes to make it permanent.",
    });
    setShowUpdateSignatureArea(false);
  };

  const simulateSave = async (setStatus: React.Dispatch<React.SetStateAction<SaveStatus>>, successMessage: string, action?: () => Promise<void> | void) => {
    setStatus("saving");
    try {
      if (action) {
        await action();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setStatus("success");
      toast({
        title: "Saved!",
        description: successMessage,
      });
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error: any) {
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not save settings. Please try again.",
      });
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    const fullNameRegex = new RegExp("^\\p{L}+(?:['\\-\\s]+\\p{L}+)+$", "u");
    if (!fullNameRegex.test(userFullName) && userFullName !== "User") {
      toast({
        variant: "destructive",
        title: "Invalid Full Name",
        description: "Please enter a valid full name (e.g., John Doe). It should consist of at least two parts, using letters and optionally spaces, hyphens, or apostrophes.",
      });
      setProfileSaveStatus("error");
      setTimeout(() => setProfileSaveStatus("idle"), 3000);
      return;
    }

    await simulateSave(setProfileSaveStatus, "Your profile changes have been saved to local storage.", async () => {
        localStorage.setItem("userFullName", userFullName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userPhoneNumber", userPhoneNumber);
        localStorage.setItem("userCompanyName", userCompanyName);

        if (userSignature) {
        localStorage.setItem("userSignature", userSignature);
        } else {
        localStorage.removeItem("userSignature");
        }
        if (avatarPreview) {
        localStorage.setItem("userAvatarUrl", avatarPreview);
        setUserAvatarUrl(avatarPreview);
        setAvatarPreview(null);
        } else if (!userAvatarUrl && !avatarPreview) {
            localStorage.removeItem("userAvatarUrl");
            setUserAvatarUrl(undefined);
        }
        
        const oldTag = localStorage.getItem("userTag");
        const namePartFromOldTag = oldTag ? oldTag.split("#")[0] : "";
        const currentNamePart = userFullName.split(" ")[0];
        if (oldTag && namePartFromOldTag !== currentNamePart) {
            const uid = localStorage.getItem("userUID");
            const tagPart = uid ? uid.substring(0,4) : oldTag.split("#")[1] || Math.random().toString(36).substring(2,6);
            const newTag = `${currentNamePart}#${tagPart}`;
            localStorage.setItem("userTag", newTag);
            setUserTag(newTag);
        }


        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('profileUpdated'));
        }
    });
  };

  const handleSecuritySave = async () => {
    if (newPassword !== confirmNewPassword) {
      toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
      return;
    }
    if (newPassword.length > 0 && newPassword.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword.length === 0 && currentPassword.length === 0) {
      toast({ title: "No Changes", description: "No password changes were entered."});
      return;
    }
     if (newPassword.length > 0 && currentPassword.length === 0) {
      toast({ variant: "destructive", title: "Current Password Required", description: "Please enter your current password to set a new one."});
      setSecuritySaveStatus("error");
      setTimeout(() => setSecuritySaveStatus("idle"), 3000);
      return;
    }


    const user = auth.currentUser;
    if (!user || !user.email) {
      toast({ variant: "destructive", title: "Error", description: "No user logged in or email missing." });
      return;
    }

    await simulateSave(setSecuritySaveStatus, "Password updated successfully.", async () => {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } catch (error: any) {
        console.error("Password update error:", error);
        throw new Error(error.message.replace("Firebase: ", "") || "Failed to update password.");
      }
    });
  };

  const handleNotificationSave = async () => {
    await simulateSave(setNotificationSaveStatus, "Notification preferences saved (mock).");
  };

  const handlePlanChange = () => {
    const newPlanDetails = availablePlans.find(p => p.id === selectedPlanInModal);
    if (!newPlanDetails) return;

    if (currentSubscription.planName === "Free Trial" && newPlanDetails.id !== "free") {
      toast({
        variant: "destructive",
        title: "Plan Update Failed",
        description: "Please contact support to change your subscription.",
        duration: 7000,
      });
      setIsChangePlanDialogOpen(false);
      return;
    }

    const newSubscription: UserSubscription = {
        planName: newPlanDetails.name,
        planPrice: newPlanDetails.price,
        renewsOn: newPlanDetails.id !== "free" ? addMonths(new Date(), 1).toISOString() : null,
        paymentMethod: newPlanDetails.id !== "free" ? (currentSubscription.paymentMethod || { type: "Visa", last4: "••••", expiry: "MM/YY" }) : null
    };

    setCurrentSubscription(newSubscription);
    localStorage.setItem("userSubscription", JSON.stringify(newSubscription));

    if (newPlanDetails.id !== "free" && newPlanDetails.priceNumeric > 0) {
      const newHistoryEntry: BillingHistoryEntry = {
        id: Date.now().toString(),
        date: format(new Date(), "yyyy-MM-dd"),
        description: `Subscribed to ${newPlanDetails.name}`,
        amount: newPlanDetails.price.replace("/month", ""),
        status: "Paid",
        invoiceUrl: "#mockInvoice"
      };
      const updatedHistory = [newHistoryEntry, ...billingHistory.filter(entry => entry.description !== "Activated Free Trial" || newPlanDetails.id === "free")];
      setBillingHistory(updatedHistory);
      localStorage.setItem("userBillingHistory", JSON.stringify(updatedHistory));
    } else if (newPlanDetails.id === "free" && currentSubscription.planName !== "Free Trial") {
        const freeTrialEntry: BillingHistoryEntry = {
            id: Date.now().toString(),
            date: format(new Date(), "yyyy-MM-dd"),
            description: "Reverted to Free Trial",
            amount: "$0/month",
            status: "Active",
        };
        const updatedHistory = [freeTrialEntry, ...billingHistory];
        setBillingHistory(updatedHistory);
        localStorage.setItem("userBillingHistory", JSON.stringify(updatedHistory));
    }


    toast({ title: "Plan Updated!", description: `You are now on the ${newPlanDetails.name}.` });
    setIsChangePlanDialogOpen(false);
    window.dispatchEvent(new CustomEvent('subscriptionUpdated')); 
  };

  const handlePaymentMethodSave = () => {
    if (!tempCardNumber || !tempCardExpiry || !tempCardCvc) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill all card details."});
        return;
    }
    if (!/^\d{13,16}$/.test(tempCardNumber.replace(/\s/g, ''))) {
        toast({ variant: "destructive", title: "Invalid Card Number", description: "Please enter a valid card number."});
        return;
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(tempCardExpiry)) {
        toast({ variant: "destructive", title: "Invalid Expiry Date", description: "Please use MM/YY format."});
        return;
    }
    if (!/^\d{3,4}$/.test(tempCardCvc)) {
        toast({ variant: "destructive", title: "Invalid CVC", description: "Please enter a valid CVC."});
        return;
    }

    toast({
      variant: "destructive",
      title: "Payment Update Failed",
      description: "Please contact support to update your payment method.",
      duration: 7000,
    });
    setIsUpdatePaymentDialogOpen(false);
    setTempCardNumber("");
    setTempCardExpiry("");
    setTempCardCvc("");
  };

  const handleCancelSubscription = () => {
    const freeTrialPlan = availablePlans.find(p => p.id === 'free')!;
    const newSubscription: UserSubscription = {
        planName: freeTrialPlan.name,
        planPrice: freeTrialPlan.price,
        renewsOn: null,
        paymentMethod: null,
    };
    setCurrentSubscription(newSubscription);
    setSelectedPlanInModal(freeTrialPlan.id);
    localStorage.setItem("userSubscription", JSON.stringify(newSubscription));

    const cancellationEntry: BillingHistoryEntry = {
        id: Date.now().toString(),
        date: format(new Date(), "yyyy-MM-dd"),
        description: `Subscription cancelled. Reverted to ${freeTrialPlan.name}.`,
        amount: "$0/month",
        status: "Active",
    };
    const updatedHistory = [cancellationEntry, ...billingHistory.filter(entry => entry.description !== "Activated Free Trial")];
    setBillingHistory(updatedHistory);
    localStorage.setItem("userBillingHistory", JSON.stringify(updatedHistory));


    toast({ title: "Subscription Cancelled", description: `You have been moved to the ${freeTrialPlan.name}.`});
    setIsCancelSubscriptionAlertOpen(false);
    window.dispatchEvent(new CustomEvent('subscriptionUpdated')); 
  };


  const renderSaveButtonContent = (status: SaveStatus, defaultText: string) => {
    if (status === "saving") return <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>;
    if (status === "success") return <><Check className="mr-2 h-4 w-4"/> Saved!</>;
    if (status === "error") return <><XCircle className="mr-2 h-4 w-4"/> Error</>;
    return <><Save className="mr-2 h-4 w-4"/> {defaultText}</>;
  };

  const currentPlanDetails = availablePlans.find(p => p.name === currentSubscription.planName) || availablePlans[0];
  const PlanIcon = currentPlanDetails.icon;

  const handleCopyTag = () => {
    if (userTag) {
      navigator.clipboard.writeText(userTag);
      toast({
        title: "User Tag Copied!",
        description: `${userTag} has been copied to your clipboard.`,
      });
    }
  };


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
      </div>
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4"/>Security</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4"/>Notifications</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4"/>Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Profile Information</CardTitle>
              <CardDescription>Manage your personal details and signature.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                   {avatarPreview || userAvatarUrl ? (
                    <AvatarImage src={avatarPreview || userAvatarUrl!} alt={`${userFullName}'s avatar`} data-ai-hint="user avatar" />
                  ) : (
                     <AvatarFallback className="bg-card border border-border flex items-center justify-center">
                        <GradientBirdIcon className="h-10 w-10 text-primary" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button variant="outline" onClick={() => avatarInputRef.current?.click()}>
                  <UploadCloud className="mr-2 h-4 w-4"/>Change Avatar
                </Button>
                 {avatarPreview && (
                  <Button variant="ghost" size="sm" onClick={() => setAvatarPreview(null)}>
                    <XCircle className="mr-1 h-4 w-4 text-destructive"/>Cancel Preview
                  </Button>
                )}
                 {userAvatarUrl && !avatarPreview && (
                  <Button variant="ghost" size="sm" onClick={() => { setUserAvatarUrl(undefined); }}>
                    <Trash2 className="mr-1 h-4 w-4 text-destructive"/>Remove Avatar
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={userFullName} onChange={(e) => setUserFullName(e.target.value)} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <Input id="phoneNumber" type="tel" value={userPhoneNumber} onChange={(e) => setUserPhoneNumber(e.target.value)} placeholder="e.g., (123) 456-7890" className="mt-1"/>
                </div>
                 <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input id="companyName" value={userCompanyName} onChange={(e) => setUserCompanyName(e.target.value)} placeholder="e.g., Acme Corp" className="mt-1"/>
                </div>
              </div>
              <div>
                 <Label htmlFor="userTagDisplay">Your User Tag</Label>
                <div className="mt-1 flex items-center space-x-2">
                    <Input id="userTagDisplay" value={userTag || "N/A"} readOnly className="bg-muted/50"/>
                    <Button variant="outline" size="sm" onClick={handleCopyTag} disabled={!userTag}>
                       <Tag className="mr-2 h-4 w-4" /> Copy Tag
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">This is your unique tag for connecting with others.</p>
              </div>
              {userJoinDate && (
                <div className="space-y-1">
                    <Label>Joined DocuSigner</Label>
                    <div className="mt-1 flex items-center space-x-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{userJoinDate}</p>
                    </div>
                </div>
              )}
              <div>
                <Label>Your Signature</Label>
                <Card
                    className="mt-1 p-4 bg-muted/30 perspective"
                    id="signature"
                    ref={signatureContainerRef}
                >
                  {userSignature && !showUpdateSignatureArea && (
                     <div className="flex flex-col items-center">
                        <motion.div
                          ref={signatureImageRef as React.RefObject<HTMLDivElement>}
                          onPointerDown={handleSignaturePointerDown}
                          className="relative transform-style-preserve-3d cursor-grab"
                          style={{ rotateX: springSigRotateX, rotateY: springSigRotateY }}
                          whileHover={{ scale: 1.03, filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.4))' }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Image
                            src={userSignature}
                            alt="Current signature"
                            width={400} height={150}
                            className="border rounded-md bg-card mx-auto mb-2 backface-hidden"
                            data-ai-hint="signature image"
                            priority
                            draggable="false"
                          />
                        </motion.div>
                        <Button variant="link" onClick={() => setShowUpdateSignatureArea(true)} className="mt-2">Update Signature</Button>
                     </div>
                  )}
                  {(!userSignature || showUpdateSignatureArea) && (
                    <div className="flex flex-col items-center space-y-4">
                      <p className="text-center text-sm text-muted-foreground">
                        {userSignature ? "Update or draw your new signature below:" : "No signature currently set. Draw below to set one."}
                      </p>
                      <SignatureCanvas
                        onSave={handleSignatureSave}
                        width={400}
                        height={150}
                        backgroundColor="transparent"
                        penColor="hsl(var(--foreground))"
                      />
                       {userSignature && showUpdateSignatureArea && (
                        <Button variant="outline" onClick={() => setShowUpdateSignatureArea(false)} className="w-full max-w-xs">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Update
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              </div>
               <div className="flex justify-end">
                 <Button
                    className={`btn-gradient-hover ${profileSaveStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : profileSaveStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={handleProfileSave}
                    disabled={profileSaveStatus === 'saving'}
                >
                    {renderSaveButtonContent(profileSaveStatus, "Save Profile Changes")}
                </Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Security Settings</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1"/>
              </div>
               <div className="flex justify-end">
                <Button
                    className={`btn-gradient-hover ${securitySaveStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : securitySaveStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={handleSecuritySave}
                    disabled={securitySaveStatus === 'saving'}
                >
                    {renderSaveButtonContent(securitySaveStatus, "Update Security Settings")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Notification Preferences</CardTitle>
              <CardDescription>Control how you receive updates from DocuSigner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="emailDocSigned" className="font-medium">Email when a document is signed</Label>
                    <Switch id="emailDocSigned" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="emailDocViewed" className="font-medium">Email when a document is viewed</Label>
                    <Switch id="emailDocViewed" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="emailNewShared" className="font-medium">Email for new documents shared with me</Label>
                    <Switch id="emailNewShared" defaultChecked/>
                </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="productUpdates" className="font-medium">Product updates and newsletters</Label>
                    <Switch id="productUpdates" />
                </div>
                <div className="flex justify-end mt-4">
                    <Button
                        className={`btn-gradient-hover ${notificationSaveStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : notificationSaveStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                        onClick={handleNotificationSave}
                        disabled={notificationSaveStatus === 'saving'}
                    >
                        {renderSaveButtonContent(notificationSaveStatus, "Save Notification Settings")}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Billing &amp; Subscription</CardTitle>
              <CardDescription>Manage your subscription plan and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <Card className="bg-muted/20 border-primary/30">
                    <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                        <PlanIcon className="h-10 w-10 text-primary mt-1" />
                        <div>
                            <CardTitle className="text-lg font-semibold">Current Plan: {currentSubscription.planName} ({currentSubscription.planPrice})</CardTitle>
                            <CardDescription className="text-xs">
                                {currentSubscription.planName === "Free Trial"
                                ? "Enjoy basic features. Upgrade for more."
                                : currentSubscription.renewsOn && isValid(parseISO(currentSubscription.renewsOn))
                                    ? `Renews on: ${format(parseISO(currentSubscription.renewsOn), "MMMM d, yyyy")}`
                                    : "Renewal date not set."}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Dialog open={isChangePlanDialogOpen} onOpenChange={setIsChangePlanDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <DollarSign className="mr-2 h-4 w-4"/> Change Plan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                <DialogTitle className="font-headline text-xl">Change Subscription Plan</DialogTitle>
                                <DialogDescription>Select a new plan that fits your needs.</DialogDescription>
                                </DialogHeader>
                                <RadioGroup value={selectedPlanInModal} onValueChange={setSelectedPlanInModal} className="my-4 space-y-3">
                                {availablePlans.map((plan) => {
                                    const CurrentPlanIcon = plan.icon;
                                    return(
                                    <Label
                                        key={plan.id}
                                        htmlFor={`plan-${plan.id}`}
                                        className={cn(
                                            "flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg cursor-pointer transition-all",
                                            selectedPlanInModal === plan.id ? "bg-primary/10 border-primary ring-2 ring-primary" : "hover:bg-accent/50"
                                        )}
                                    >
                                        <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="mt-1 sm:mt-0 flex-shrink-0" />
                                        <div className="flex items-center space-x-3">
                                            <CurrentPlanIcon className="h-6 w-6 text-primary flex-shrink-0" />
                                            <div className="flex-grow">
                                                <span className="font-semibold">{plan.name}</span>
                                                <span className="text-sm text-muted-foreground ml-2">{plan.price}</span>
                                                <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                                    {plan.features.map(f => <li key={f}>{f}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </Label>
                                )})}
                                </RadioGroup>
                                <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <AlertDialogButton onClick={handlePlanChange} className="btn-gradient-hover" disabled={currentSubscription.planName === availablePlans.find(p=>p.id === selectedPlanInModal)?.name}>
                                    Confirm Change
                                </AlertDialogButton>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                 <div>
                    <h4 className="font-semibold mb-2 text-md">Payment Method</h4>
                    {currentSubscription.paymentMethod && currentSubscription.planName !== "Free Trial" ? (
                        <Card className="border-dashed">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <CreditCard className="mr-3 h-8 w-8 text-muted-foreground"/>
                                    <div>
                                        <p className="font-medium">{currentSubscription.paymentMethod.type} ending in {currentSubscription.paymentMethod.last4}</p>
                                        <p className="text-xs text-muted-foreground">Expires {currentSubscription.paymentMethod.expiry}</p>
                                    </div>
                                </div>
                                <Dialog open={isUpdatePaymentDialogOpen} onOpenChange={setIsUpdatePaymentDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">Update</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="font-headline">Update Payment Method</DialogTitle>
                                            <DialogDescription>Enter your new card details below.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cardNumber" className="text-right col-span-1">Card No.</Label>
                                                <Input id="cardNumber" value={tempCardNumber} onChange={e => setTempCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cardExpiry" className="text-right col-span-1">Expiry</Label>
                                                <Input id="cardExpiry" value={tempCardExpiry} onChange={e => setTempCardExpiry(e.target.value)} placeholder="MM/YY" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cardCvc" className="text-right col-span-1">CVC</Label>
                                                <Input id="cardCvc" value={tempCardCvc} onChange={e => setTempCardCvc(e.target.value)} placeholder="•••" className="col-span-3" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                            <AlertDialogButton onClick={handlePaymentMethodSave} className="btn-gradient-hover">Save Card</AlertDialogButton>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed text-center">
                             <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground mb-3">No payment method on file. Required for paid plans.</p>
                                <Dialog open={isUpdatePaymentDialogOpen} onOpenChange={setIsUpdatePaymentDialogOpen}>
                                    <DialogTrigger asChild>
                                         <Button variant="secondary">
                                            <CreditCard className="mr-2 h-4 w-4"/> Add Payment Method
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="font-headline">Add Payment Method</DialogTitle>
                                            <DialogDescription>Enter your card details below.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cardNumberModal" className="text-right col-span-1">Card No.</Label>
                                                <Input id="cardNumberModal" value={tempCardNumber} onChange={e => setTempCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cardExpiryModal" className="text-right col-span-1">Expiry</Label>
                                                <Input id="cardExpiryModal" value={tempCardExpiry} onChange={e => setTempCardExpiry(e.target.value)} placeholder="MM/YY" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cardCvcModal" className="text-right col-span-1">CVC</Label>
                                                <Input id="cardCvcModal" value={tempCardCvc} onChange={e => setTempCardCvc(e.target.value)} placeholder="•••" className="col-span-3" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                            <AlertDialogButton onClick={handlePaymentMethodSave} className="btn-gradient-hover">Save Card</AlertDialogButton>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    )}
                 </div>

                 <div>
                    <h4 className="font-semibold mb-2 text-md">Billing History</h4>
                    {billingHistory.length > 0 ? (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {billingHistory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{isValid(parseISO(item.date)) ? format(parseISO(item.date), "MMM d, yyyy") : "Invalid Date"}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell>
                                            <span className={cn("px-2 py-0.5 rounded-full text-xs",
                                                item.status === "Paid" && "bg-green-100 text-green-700",
                                                item.status === "Pending" && "bg-yellow-100 text-yellow-700",
                                                item.status === "Failed" && "bg-red-100 text-red-700",
                                                item.status === "Active" && "bg-blue-100 text-blue-700"
                                            )}>{item.status}</span>
                                        </TableCell>
                                        <TableCell>
                                            {item.invoiceUrl && <AlertDialogButton variant="link" size="sm" className="p-0 h-auto" asChild><a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer">View</a></AlertDialogButton>}
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="p-6 text-center">
                                <FileClock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No billing history available yet.</p>
                            </CardContent>
                        </Card>
                    )}
                 </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center">
                            <strong className="font-medium text-foreground w-32">User Tag:</strong>
                            <span className="text-muted-foreground flex-grow">{userTag || "Not set"}</span>
                            {userTag && (
                                <Button variant="outline" size="xs" onClick={handleCopyTag} className="ml-2 h-auto px-2 py-1">
                                    Copy
                                </Button>
                            )}
                        </div>
                        <p><strong className="font-medium text-foreground">Joined DocuSigner:</strong> {userJoinDate || "N/A"}</p>
                        <p><strong className="font-medium text-foreground">User Role:</strong> User</p>
                    </CardContent>
                </Card>
                {currentSubscription.planName !== "Free Trial" && (
                    <div className="flex justify-end pt-4">
                        <AlertDialog open={isCancelSubscriptionAlertOpen} onOpenChange={setIsCancelSubscriptionAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="group">
                                    <AlertTriangle className="mr-2 h-4 w-4 group-hover:animate-pulse" /> Cancel Subscription
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will cancel your "{currentSubscription.planName}" subscription. You will be moved to the Free Trial plan.
                                    This action cannot be undone for the current billing cycle.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelSubscription} className={buttonVariants({variant: "destructive"})}>
                                    Yes, Cancel Subscription
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
