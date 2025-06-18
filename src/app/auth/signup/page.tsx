
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/shared/Stepper";
import { SignatureCanvas } from "@/components/auth/SignatureCanvas";
import { Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle, Loader2, RefreshCw, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { addNotification } from "@/lib/notificationManager";

const accountDetailsSchema = z.object({
  fullName: z.string()
    .min(3, { message: "Full name must be at least 3 characters." })
    .regex(new RegExp("^\\p{L}+(?:['\\-\\s]+\\p{L}+)+$", "u"), { // Unicode aware, at least two words
      message: "Please enter a valid full name (e.g., John Doe). It should consist of at least two parts, using letters and optionally spaces, hyphens, or apostrophes.",
    }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>;

const RESEND_COOLDOWN_SECONDS = 60;

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountDetails, setAccountDetails] = useState<Partial<AccountDetailsFormValues>>({});
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [resendDisabledUntil, setResendDisabledUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isClientEmailVerified, setIsClientEmailVerified] = useState(false);
  
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);
  const [initialAuthChecked, setInitialAuthChecked] = useState(false);


  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const stepperStepsConfig = [
    { name: "Account", isCompleted: false, isCurrent: true },
    { name: "Verify Email", isCompleted: false, isCurrent: false },
    { name: "Your Signature", isCompleted: false, isCurrent: false },
  ];
  const [stepperSteps, setStepperSteps] = useState(stepperStepsConfig);


  useEffect(() => {
    setStepperSteps(prevSteps => prevSteps.map((step, index) => ({
      ...step,
      isCompleted: index < currentStep -1,
      isCurrent: index === currentStep - 1,
    })));
  }, [currentStep]);

  useEffect(() => {
    const verifyProcess = searchParams.get('verifyProcess');
    const emailFromQuery = searchParams.get('email');

    console.log("SignUpForm useEffect for searchParams triggered.");
    console.log("URL Params: verifyProcess=", verifyProcess, "emailFromQuery=", emailFromQuery, "initialAuthChecked=", initialAuthChecked);

    let unsubscribeAuth: (() => void) | null = null; 

    if (verifyProcess === 'true' && emailFromQuery && !initialAuthChecked) {
      setIsProcessingRedirect(true);
      console.log("Detected verification redirect. Email from query:", emailFromQuery);

      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        console.log("onAuthStateChanged (redirect flow) triggered. User:", user);
        setInitialAuthChecked(true); 

        if (user && user.email === emailFromQuery) {
          console.log("User found and email matches. Reloading user...");
          try {
            await user.reload();
            const reloadedUser = auth.currentUser; 
            console.log("User reloaded. Email verified status:", reloadedUser?.emailVerified);

            if (reloadedUser?.emailVerified) {
              console.log("Email is verified. Setting up for step 3.");
              setFirebaseUser(reloadedUser);
              setAccountDetails({ 
                fullName: reloadedUser.displayName || "",
                email: reloadedUser.email || "",
              });
              setIsClientEmailVerified(true);
              setCurrentStep(3);
              toast({ title: "Email Verified!", description: "Please set up your signature to complete registration." });
            } else {
              console.log("Email not yet verified after reload. Setting up for step 2.");
              setFirebaseUser(reloadedUser);
              setAccountDetails(prev => ({ 
                 ...prev,
                 fullName: reloadedUser?.displayName || prev.fullName || "",
                 email: reloadedUser?.email || prev.email || ""
              }));
              setIsClientEmailVerified(false);
              setCurrentStep(2);
              toast({ title: "Verification Still Pending", description: "Please ensure you've clicked the link. You might need to refresh status on this page.", variant: "default" });
            }
          } catch (error: any) {
            console.error("Error reloading user for verification:", error);
            setCurrentStep(1); 
            let detailedErrorMessage = "Could not check verification status.";
            if (error.code && error.message) {
                  detailedErrorMessage = `Error: ${error.message} (Code: ${error.code})`.replace("Firebase: ", "");
            } else if (error.message) {
                  detailedErrorMessage = error.message.replace("Firebase: ", "");
            }
            toast({ variant: "destructive", title: "Verification Check Failed", description: detailedErrorMessage });
          }
        } else if (user && user.email !== emailFromQuery) {
          console.warn("User session mismatch. Logged in as:", user.email, "Expected:", emailFromQuery);
          setCurrentStep(1);
          toast({ variant: "destructive", title: "Session Mismatch", description: "Logged in user does not match verification email. Please sign out and try the link again, or sign up anew."});
        } else {
          console.log("No user found or email mismatch after onAuthStateChanged. Defaulting to step 1.");
          setCurrentStep(1);
        }

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('verifyProcess');
        newUrl.searchParams.delete('email');
        newUrl.searchParams.delete('mode');
        newUrl.searchParams.delete('oobCode');
        newUrl.searchParams.delete('apiKey');
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });

        setIsProcessingRedirect(false);
      });
    } else if (!verifyProcess && !initialAuthChecked) {
        console.log("Normal page load, setting up initial auth check listener.");
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            console.log("onAuthStateChanged (normal load) triggered. User:", user);
            setInitialAuthChecked(true); 
            if (user) {
                setFirebaseUser(user);
                setIsClientEmailVerified(user.emailVerified);
                setAccountDetails(prev => ({
                    ...prev,
                    fullName: user.displayName || prev.fullName || "",
                    email: user.email || prev.email || ""
                }));
            }
        });
    }

    return () => { 
      if (unsubscribeAuth) {
        console.log("Cleaning up onAuthStateChanged listener from useEffect.");
        unsubscribeAuth();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, initialAuthChecked]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendDisabledUntil && Date.now() < resendDisabledUntil) {
      setCountdown(Math.ceil((resendDisabledUntil - Date.now()) / 1000));
      interval = setInterval(() => {
        const newCountdown = Math.ceil((resendDisabledUntil - Date.now()) / 1000);
        if (newCountdown <= 0) {
          setCountdown(0);
          setResendDisabledUntil(null);
          clearInterval(interval);
        } else {
          setCountdown(newCountdown);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabledUntil]);


  const accountForm = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAccountDetailsSubmit = async (values: AccountDetailsFormValues) => {
    setIsLoading(true);
    console.log("Attempting to submit account details:", values.email);

    if (auth.currentUser && auth.currentUser.email === values.email && auth.currentUser.emailVerified) {
      console.log("Account already verified for this email. Setting up for step 3.");
      toast({
        title: "Account Already Verified",
        description: "This email is associated with a verified account. Proceeding to signature setup.",
      });
      setFirebaseUser(auth.currentUser);
      setIsClientEmailVerified(true);
      setAccountDetails({ fullName: auth.currentUser.displayName || values.fullName, email: values.email });
      setCurrentStep(3);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Creating user with email and password...");
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      console.log("User created:", user?.uid);

      if (user) {
        console.log("Updating user profile with full name:", values.fullName);
        await updateProfile(user, { displayName: values.fullName });
        
        if (!user.email) {
          console.error("User email is null after creation. Critical error.");
          toast({ variant: "destructive", title: "Critical Error", description: "User email is missing. Cannot proceed." });
          setIsLoading(false);
          return;
        }

        if (typeof window === 'undefined' || !window.location.origin) {
          console.error("window.location.origin is not available. Cannot construct verification URL.");
          toast({ variant: "destructive", title: "Configuration Error", description: "Cannot determine app origin." });
          setIsLoading(false);
          return;
        }
        
        const origin = window.location.origin;
        console.log("Current window.location.origin for Firebase action URL:", origin);
        
        const actionCodeSettings = {
          url: `${origin}/auth/signup?verifyProcess=true&email=${encodeURIComponent(user.email)}`,
          handleCodeInApp: true,
        };
        console.log("Action code settings URL:", actionCodeSettings.url);

        console.log("Sending email verification...");
        await sendEmailVerification(user, actionCodeSettings);
        console.log("Email verification sent.");
        
        setAccountDetails(values);
        setFirebaseUser(user); 
        setCurrentStep(2);
        setIsClientEmailVerified(false);
        toast({
          title: "Account Created! Verify Your Email",
          description: `We've sent a verification link to ${values.email}. Please check your inbox (and spam folder) and click the link to continue.`,
          duration: 10000,
        });
      } else {
        console.error("User object is null after creation.");
        throw new Error("User object is null after creation.");
      }
    } catch (error: any) {
      console.error("Firebase SignUp Error in handleAccountDetailsSubmit:", error);
      let errorMessage = "An unexpected error occurred during sign up.";
      if (error.code && error.message) { 
        errorMessage = `Error: ${error.message} (Code: ${error.code})`.replace("Firebase: ", "");
      } else if (error.message) { 
        errorMessage = error.message.replace("Firebase: ", "");
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    const currentUser = firebaseUser || auth.currentUser;
    if (!currentUser) {
      toast({ variant: "destructive", title: "Error", description: "User session not found. Please try signing up again or sign in." });
      return;
    }
    setIsCheckingVerification(true);
    console.log("Checking verification status for user:", currentUser.email);
    try {
      await currentUser.reload();
      const updatedUser = auth.currentUser;
      console.log("User reloaded. New verified status:", updatedUser?.emailVerified); 
      if (updatedUser?.emailVerified) {
        setFirebaseUser(updatedUser); 
        setIsClientEmailVerified(true); 
        setAccountDetails(prev => ({
          ...prev,
          fullName: updatedUser.displayName || prev.fullName || "",
          email: updatedUser.email || prev.email || "",
        }));
        toast({ title: "Email Verified!", description: "You can now proceed to set up your signature." });
      } else {
        toast({
          title: "Email Not Verified",
          description: "Your email is not yet verified. Please click the link in the email we sent you, or try resending it.",
          variant: "default",
          duration: 7000,
        });
      }
    } catch (error: any) {
      console.error("Error checking verification status:", error);
      let detailedErrorMessage = "Could not check verification status.";
      if (error.code && error.message) {
            detailedErrorMessage = `Error: ${error.message} (Code: ${error.code})`.replace("Firebase: ", "");
      } else if (error.message) {
            detailedErrorMessage = error.message.replace("Firebase: ", "");
      }
      toast({ variant: "destructive", title: "Verification Check Error", description: detailedErrorMessage });
    } finally {
      setIsCheckingVerification(false);
    }
  };
  
  const handleResendVerificationEmail = async () => {
    const currentUser = firebaseUser || auth.currentUser;
    if (!currentUser || !currentUser.email) {
        toast({ variant: "destructive", title: "Error", description: "No user session or email available to resend email." });
        return;
    }
    if (resendDisabledUntil && Date.now() < resendDisabledUntil) {
        toast({ title: "Please Wait", description: `You can resend the email in ${countdown} seconds.`});
        return;
    }

    setIsLoading(true);
    console.log("Attempting to resend verification email to:", currentUser.email);
    try {
      if (typeof window === 'undefined' || !window.location.origin) {
        console.error("window.location.origin is not available for resend. Cannot construct verification URL.");
        toast({ variant: "destructive", title: "Configuration Error", description: "Cannot determine app origin."});
        setIsLoading(false);
        return;
      }
      const origin = window.location.origin;
      console.log("Resending verification. Current window.location.origin for Firebase action URL:", origin);
      const actionCodeSettings = {
        url: `${origin}/auth/signup?verifyProcess=true&email=${encodeURIComponent(currentUser.email)}`,
        handleCodeInApp: true,
      };
      console.log("Action code settings for resend:", actionCodeSettings.url);
      await sendEmailVerification(currentUser, actionCodeSettings);
      console.log("Verification email resent successfully.");
      toast({
        title: "Verification Email Resent",
        description: `A new verification link has been sent to ${currentUser.email}.`,
        duration: 7000,
      });
      setResendDisabledUntil(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
    } catch (error: any) {
      let detailedErrorMessage = "Could not resend verification email.";
      if (error.code && error.message) {
            detailedErrorMessage = `Error: ${error.message} (Code: ${error.code})`.replace("Firebase: ", "");
      } else if (error.message) {
            detailedErrorMessage = error.message.replace("Firebase: ", "");
      } else if (typeof error === 'object' && error !== null) {
            detailedErrorMessage = JSON.stringify(error);
      }
      console.error("Error resending verification email:", error, "Formatted message:", detailedErrorMessage);
      toast({
        variant: "destructive",
        title: "Error Resending Email",
        description: detailedErrorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSignature = async (dataUrl: string) => {
    const userToSave = firebaseUser || auth.currentUser; 
    if (!userToSave || !accountDetails.fullName || !userToSave.email) {
      toast({ variant: "destructive", title: "Error", description: "User data, full name, or email is missing." });
      setIsLoading(false);
      return;
    }
    
    if (!isClientEmailVerified && !userToSave.emailVerified) { 
        try {
            await userToSave.reload();
            if (!auth.currentUser?.emailVerified) { 
                toast({ variant: "destructive", title: "Email Not Verified", description: "Please verify your email before saving signature."});
                setCurrentStep(2); 
                setIsLoading(false);
                return;
            }
            setIsClientEmailVerified(true); 
        } catch (e) {
            toast({ variant: "destructive", title: "Verification Error", description: "Could not confirm email verification. Please try again."});
            setCurrentStep(2);
            setIsLoading(false);
            return;
        }
    }

    setIsLoading(true);
    console.log("Saving signature for user:", userToSave.email);
    const registrationTimestamp = new Date().toISOString();
    try {
      localStorage.setItem("userUID", userToSave.uid);
      localStorage.setItem("userFullName", accountDetails.fullName); 
      localStorage.setItem("userEmail", userToSave.email);
      localStorage.setItem("userSignature", dataUrl);
      localStorage.setItem("userJoinDate", registrationTimestamp);
      localStorage.setItem("userAvatarUrl", userToSave.photoURL || ""); 

      console.log("Signature and user data saved to localStorage.");

      addNotification({
        title: "Welcome to DocuSigner!",
        description: `Explore your dashboard and start managing documents efficiently, ${accountDetails.fullName}.`,
        iconName: "Bell",
        link: "/dashboard",
        category: "system",
        timestamp: registrationTimestamp,
      });
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to DocuSigner! Redirecting to dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error saving signature/redirecting:", error);
      let detailedErrorMessage = "Could not complete registration.";
       if (error.message) {
            detailedErrorMessage = error.message.replace("Firebase: ", "");
      } else if (typeof error === 'object' && error !== null) {
            detailedErrorMessage = JSON.stringify(error);
      }
      toast({ variant: "destructive", title: "Finalization Error", description: detailedErrorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 3 && isClientEmailVerified) { 
         setCurrentStep(2);
         return;
    }
    if (currentStep === 2) { 
        setAccountDetails(prev => ({ ...prev, password: '', confirmPassword: '' }));
        accountForm.reset({ ...accountForm.getValues(), password: '', confirmPassword: ''});
        setCurrentStep(1);
        return;
    }
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleContinueToSignature = () => {
    if(isClientEmailVerified) {
      if (!accountDetails.email && firebaseUser?.email) {
        setAccountDetails({
          fullName: firebaseUser.displayName || "",
          email: firebaseUser.email,
        });
      }
      setCurrentStep(3);
    } else {
      toast({ title: "Email Not Verified", description: "Please verify your email first or refresh the status." });
    }
  };

  const cardVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Card className="w-full max-w-lg shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="text-center bg-muted/30 p-6">
        <CardTitle className="text-3xl font-headline">Create Your Account</CardTitle>
        <CardDescription>Join DocuSigner in just a few simple steps.</CardDescription>
        <Stepper steps={stepperSteps} className="mt-4" />
      </CardHeader>
      <CardContent className="p-6 md:p-8 min-h-[400px]">
        {isProcessingRedirect && (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Processing email verification...</p>
            <p className="text-sm text-muted-foreground">Please wait.</p>
          </div>
        )}
        {!isProcessingRedirect && (
            <AnimatePresence mode="wait">
            {currentStep === 1 && (
                <motion.div
                key="step1"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                >
                <Form {...accountForm}>
                    <form onSubmit={accountForm.handleSubmit(handleAccountDetailsSubmit)} className="space-y-4">
                    <FormField
                        control={accountForm.control}
                        name="fullName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                                <Input placeholder="John Doe" {...field} className="pl-10" disabled={isLoading} />
                            </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={accountForm.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} className="pl-10" disabled={isLoading} />
                            </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={accountForm.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} className="pl-10" disabled={isLoading} />
                            </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={accountForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} className="pl-10" disabled={isLoading} />
                            </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full btn-gradient-hover" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                        <span>{isLoading ? "Creating Account..." : "Create Account & Verify Email"}</span>
                    </Button>
                    </form>
                </Form>
                </motion.div>
            )}

            {currentStep === 2 && (
                <motion.div
                key="step2-verify"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
                >
                {isClientEmailVerified ? (
                    <>
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 font-headline">Email Successfully Verified!</h3>
                    <p className="text-muted-foreground mb-6">
                        You can now proceed to set up your signature.
                    </p>
                    <Button onClick={handleContinueToSignature} className="w-full btn-gradient-hover" disabled={isLoading || isCheckingVerification}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Continue to Signature Setup
                    </Button>
                    <Button variant="outline" onClick={handlePreviousStep} className="mt-2 w-full" disabled={isLoading || isCheckingVerification}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Account Details
                    </Button>
                    </>
                ) : (
                    <>
                    <Mail className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2 font-headline">Verify Your Email</h3>
                    <p className="text-muted-foreground mb-1">
                        A verification link has been sent to:
                    </p>
                    <p className="font-medium text-foreground mb-4 break-all">{firebaseUser?.email || accountDetails.email || "your email address"}</p>
                    <p className="text-muted-foreground mb-6 text-sm">
                        Please click the link in that email to verify your account. After verification, you might need to click "Refresh Status" or this page may update automatically if you return to it.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs sm:max-w-sm">
                        <Button variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto" disabled={isLoading || isCheckingVerification}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={checkVerificationStatus} className="w-full btn-gradient-hover flex-1" disabled={isLoading || isCheckingVerification}>
                            {isCheckingVerification ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            <span>{isCheckingVerification ? "Checking..." : "Refresh Verification Status"}</span>
                        </Button>
                    </div>
                    <Button 
                        variant="link" 
                        onClick={handleResendVerificationEmail} 
                        className="mt-4 text-sm" 
                        disabled={isLoading || isCheckingVerification || (resendDisabledUntil !== null && Date.now() < resendDisabledUntil)}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {countdown > 0 ? `Resend Email (${countdown}s)` : "Resend Verification Email"}
                    </Button>
                    </>
                )}
                </motion.div>
            )}

            {currentStep === 3 && ( 
                <motion.div
                key="step3-signature"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
                >
                <h3 className="text-xl font-semibold mb-2 text-center font-headline">Your Signature</h3>
                <p className="text-muted-foreground mb-4 text-center text-sm">
                    Please provide your handwritten signature. This will be used for your documents.
                </p>
                <SignatureCanvas 
                    onSave={handleSaveSignature} 
                    width={400} 
                    height={150}
                    backgroundColor="transparent" 
                    penColor="hsl(var(--foreground))"
                />
                <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full max-w-xs">
                    <Button variant="outline" onClick={handlePreviousStep} className="w-full" disabled={isLoading}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        )}
        {!isProcessingRedirect && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                Sign In
            </Link>
            </p>
        )}
      </CardContent>
    </Card>
  );
}
