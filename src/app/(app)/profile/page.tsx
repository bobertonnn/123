
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit3, Mail, Phone, Tag, Building, Link as LinkIcon, Share2 } from "lucide-react"; 
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GradientBirdIcon } from "@/components/icons/Logo";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"; 

interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string | undefined;
  title: string;
  department: string; 
  phoneNumber: string;
  companyName: string;
  joinDate: string;
  signatureUrl: string | null;
  userTag: string | null;
  referralLink: string | null; // Added
}

export default function ProfilePage() {
  const { toast } = useToast(); 
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "User",
    email: "user@example.com",
    avatarUrl: undefined,
    title: "Document Signer",
    department: "N/A", 
    phoneNumber: "N/A",
    companyName: "N/A",
    joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    signatureUrl: null,
    userTag: null,
    referralLink: null, // Added
  });

  const loadProfileData = () => {
      let storedFullName = localStorage.getItem("userFullName");
      let storedEmail = localStorage.getItem("userEmail");
      const storedPhoneNumber = localStorage.getItem("userPhoneNumber");
      const storedCompanyName = localStorage.getItem("userCompanyName");
      const storedSignature = localStorage.getItem("userSignature");
      const storedAvatar = localStorage.getItem("userAvatarUrl");
      const storedJoinDate = localStorage.getItem("userJoinDate") || new Date().toISOString();
      const storedUserTag = localStorage.getItem("userTag"); 
      
      let referralLinkValue = null;
      if (typeof window !== 'undefined' && storedUserTag) {
        referralLinkValue = `${window.location.origin}/auth/signup?ref=${encodeURIComponent(storedUserTag)}`;
      }

      setProfileData(prev => ({
      ...prev,
      name: (storedFullName && storedFullName.trim() !== "") ? storedFullName.trim() : "User",
      email: (storedEmail && storedEmail.trim() !== "") ? storedEmail.trim() : "user@example.com",
      phoneNumber: storedPhoneNumber || "N/A",
      companyName: storedCompanyName || "N/A",
      signatureUrl: storedSignature || null,
      avatarUrl: (storedAvatar && storedAvatar.trim() !== "") ? storedAvatar : undefined,
      joinDate: new Date(storedJoinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      userTag: storedUserTag || null, 
      referralLink: referralLinkValue, // Added
      }));
  };

  useEffect(() => {
    loadProfileData();
    window.addEventListener('profileUpdated', loadProfileData);
    return () => {
        window.removeEventListener('profileUpdated', loadProfileData);
    }
  }, []);

  const handleCopyText = (textToCopy: string | null, successMessage: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: successMessage,
      });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <User className="mr-3 h-8 w-8 text-primary" /> User Profile
        </h1>
        <Button asChild variant="outline">
          <Link href="/settings">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-muted/30 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              {profileData.avatarUrl ? (
                <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              ) : null}
              <AvatarFallback className={!profileData.avatarUrl ? "bg-card border border-border flex items-center justify-center" : "bg-muted flex items-center justify-center"}>
                <GradientBirdIcon
                  className={cn(
                    "h-16 w-16",
                    !profileData.avatarUrl ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{profileData.name}</h2>
              <p className="text-lg text-muted-foreground">{profileData.title}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground items-center">
                {profileData.email !== "user@example.com" && <span className="flex items-center"><Mail className="mr-1.5 h-4 w-4"/> {profileData.email}</span>}
                {profileData.phoneNumber !== "N/A" && <span className="flex items-center"><Phone className="mr-1.5 h-4 w-4"/> {profileData.phoneNumber}</span>}
                {profileData.companyName !== "N/A" && <span className="flex items-center"><Building className="mr-1.5 h-4 w-4"/> {profileData.companyName}</span>}
                {profileData.userTag && (
                  <div className="flex items-center space-x-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs sm:text-sm cursor-pointer hover:bg-primary/20"
                       onClick={() => handleCopyText(profileData.userTag, `${profileData.userTag} has been copied to your clipboard.`)}
                       title="Copy User Tag"
                  >
                    <Tag className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4"/> 
                    <span>{profileData.userTag}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong className="font-medium text-foreground">Email:</strong> {profileData.email}</p>
                <p><strong className="font-medium text-foreground">Phone:</strong> {profileData.phoneNumber}</p>
                <p><strong className="font-medium text-foreground">Company:</strong> {profileData.companyName}</p>
                <p><strong className="font-medium text-foreground">Department:</strong> {profileData.department}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                 <p><strong className="font-medium text-foreground">User Tag:</strong> {profileData.userTag || "Not set"}</p>
                <p><strong className="font-medium text-foreground">Joined DocuSigner:</strong> {profileData.joinDate}</p>
                <p><strong className="font-medium text-foreground">User Role:</strong> User</p>
                 <p className="flex items-center">
                    <strong className="font-medium text-foreground">Date Registered:</strong>
                    <span className="text-muted-foreground ml-2">{profileData.joinDate}</span>
                  </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Registered Signature</CardTitle>
                <CardDescription>This is the signature used for your documents.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {profileData.signatureUrl ? (
                  <Image src={profileData.signatureUrl} alt="User signature" width={400} height={150} className="border rounded-md bg-card shadow-sm" />
                ) : (
                  <div className="w-full max-w-[400px] h-[150px] border rounded-md bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No signature set</p>
                  </div>
                )}
                <Button variant="link" className="mt-2 text-sm" asChild>
                  <Link href="/settings#signature">Update Signature</Link>
                </Button>
              </CardContent>
            </Card>
            
            {profileData.referralLink && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Share2 className="mr-2 h-5 w-5 text-primary"/> Your Referral Link
                  </CardTitle>
                  <CardDescription>Share this link with others to invite them to DocuSigner.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground"/>
                        <input 
                            type="text" 
                            value={profileData.referralLink} 
                            readOnly 
                            className="text-xs text-muted-foreground bg-transparent flex-grow p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleCopyText(profileData.referralLink, "Referral link copied to clipboard!")}
                    >
                        Copy Link
                    </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
