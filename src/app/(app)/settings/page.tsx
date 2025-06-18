
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Bell, CreditCard, Save, Edit3, XCircle, Loader2, Check, UploadCloud, Trash2 } from "lucide-react";
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

type SaveStatus = "idle" | "saving" | "success" | "error";

const SIGNATURE_MAX_ROTATION = 15; // Reduced for a subtler effect
const signatureSpringConfig = { stiffness: 150, damping: 30, mass: 0.8 }; // Adjusted for smoother animation

export default function SettingsPage() {
  const [userFullName, setUserFullName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showUpdateSignatureArea, setShowUpdateSignatureArea] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const signatureContainerRef = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>("idle");
  const [securitySaveStatus, setSecuritySaveStatus] = useState<SaveStatus>("idle");
  const [notificationSaveStatus, setNotificationSaveStatus] = useState<SaveStatus>("idle");

  const { toast } = useToast();

  const sigRotateX = useMotionValue(0);
  const sigRotateY = useMotionValue(0);
  const springSigRotateX = useSpring(sigRotateX, signatureSpringConfig);
  const springSigRotateY = useSpring(sigRotateY, signatureSpringConfig);

  const handleSignatureMouseMove = useCallback((event: globalThis.MouseEvent) => {
    if (!signatureContainerRef.current) return;
    const rect = signatureContainerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    const newRotateY = (mouseX / (rect.width / 2)) * SIGNATURE_MAX_ROTATION;
    const newRotateX = -(mouseY / (rect.height / 2)) * SIGNATURE_MAX_ROTATION;
    sigRotateX.set(newRotateX);
    sigRotateY.set(newRotateY);
  }, [sigRotateX, sigRotateY]);

  const handleSignatureMouseLeave = useCallback(() => {
    sigRotateX.set(0);
    sigRotateY.set(0);
  }, [sigRotateX, sigRotateY]);


  useEffect(() => {
    const storedFullName = localStorage.getItem("userFullName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedSignature = localStorage.getItem("userSignature");
    const storedAvatar = localStorage.getItem("userAvatarUrl");

    if (storedFullName && storedFullName.trim() !== "") setUserFullName(storedFullName.trim());
    else setUserFullName("User");

    if (storedEmail && storedEmail.trim() !== "") setUserEmail(storedEmail.trim());
    else setUserEmail("user@example.com");

    if (storedSignature) {
        setUserSignature(storedSignature);
        setShowUpdateSignatureArea(false);
    } else {
        setShowUpdateSignatureArea(true);
    }
    if (storedAvatar && storedAvatar.trim() !== "") setUserAvatarUrl(storedAvatar);
    else setUserAvatarUrl(undefined);

  }, []);

  useEffect(() => {
    const currentSignatureContainer = signatureContainerRef.current;
    if (currentSignatureContainer && userSignature && !showUpdateSignatureArea) { // Only add listeners if signature is shown
      currentSignatureContainer.addEventListener('mousemove', handleSignatureMouseMove);
      currentSignatureContainer.addEventListener('mouseleave', handleSignatureMouseLeave);
    }
    return () => {
      if (currentSignatureContainer) {
        currentSignatureContainer.removeEventListener('mousemove', handleSignatureMouseMove);
        currentSignatureContainer.removeEventListener('mouseleave', handleSignatureMouseLeave);
      }
    };
  }, [handleSignatureMouseMove, handleSignatureMouseLeave, userSignature, showUpdateSignatureArea]);


  const handleSignatureSave = (dataUrl: string) => {
    setUserSignature(dataUrl);
    toast({
      title: "Signature Updated!",
      description: "Your new signature is ready. Save profile changes to make it permanent.",
    });
    setShowUpdateSignatureArea(false);
  };

  const simulateSave = async (setStatus: React.Dispatch<React.SetStateAction<SaveStatus>>, successMessage: string, action?: () => Promise<void>) => {
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
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "New password must be at least 6 characters long." });
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

  const renderSaveButtonContent = (status: SaveStatus, defaultText: string) => {
    if (status === "saving") return <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>;
    if (status === "success") return <><Check className="mr-2 h-4 w-4"/> Saved!</>;
    if (status === "error") return <><XCircle className="mr-2 h-4 w-4"/> Error</>;
    return <><Save className="mr-2 h-4 w-4"/> {defaultText}</>;
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
                    <AvatarImage src={avatarPreview || userAvatarUrl!} alt={`${userFullName}'s avatar`} data-ai-hint="person avatar" />
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
              </div>
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
                          className="relative transform-style-preserve-3d cursor-grab"
                          style={{ rotateX: springSigRotateX, rotateY: springSigRotateY }}
                          whileHover={{ scale: 1.03, filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.4))' }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Image 
                            src={userSignature} 
                            alt="Current signature" 
                            width={400} height={150} 
                            className="border rounded-md bg-card mx-auto mb-2 shadow-sm backface-hidden" 
                            data-ai-hint="signature image"
                            priority 
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
              <div className="flex items-center space-x-2">
                <Switch id="2fa" />
                <Label htmlFor="2fa">Enable Two-Factor Authentication (2FA)</Label>
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
              <CardTitle className="text-xl font-headline">Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription plan and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-primary/5">
                    <h4 className="font-semibold">Current Plan: Pro Tier</h4>
                    <p className="text-sm text-muted-foreground">Renews on: December 1, 2024</p>
                    <Button variant="link" className="p-0 h-auto text-primary">Change Plan</Button>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Payment Method</h4>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                            <CreditCard className="mr-3 h-6 w-6 text-muted-foreground"/>
                            <div>
                                <p>Visa ending in 1234</p>
                                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                    </div>
                 </div>
                 <div>
                    <h4 className="font-semibold mb-2">Billing History</h4>
                    <p className="text-sm text-muted-foreground p-3 border rounded-lg">No billing history available yet. Or list invoices here.</p>
                 </div>
                  <div className="flex justify-end">
                    <Button variant="destructive">Cancel Subscription</Button>
                  </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
