
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const resetSchema = z.object({
  resetEmail: z.string().email({ message: "Invalid email address." }),
});

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  const signInForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      resetEmail: "",
    },
  });

  async function onSignInSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        if (!user.emailVerified) {
          toast({
            title: "Email Not Verified",
            description: "Please verify your email address by clicking the link sent to your inbox. Some features may be limited.",
            variant: "default",
            duration: 7000,
          });
        } else {
            toast({
                title: "Sign In Successful!",
                description: `Welcome back, ${user.displayName || user.email}!`,
            });
        }
        
        localStorage.setItem("userUID", user.uid);
        if (user.displayName) localStorage.setItem("userFullName", user.displayName);
        if (user.email) localStorage.setItem("userEmail", user.email);
        
        router.push('/dashboard');
      } else {
        throw new Error("User object is null after sign in.");
      }
    } catch (error: any) {
      console.error("Firebase SignIn Error:", error);
      const errorMessage = error.message || "Failed to sign in. Please check your credentials.";
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage.replace("Firebase: ", ""),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetPasswordSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${values.resetEmail}, a password reset link has been sent. Please check your inbox (and spam folder).`,
        duration: 10000,
      });
      setShowResetPasswordForm(false); // Go back to sign-in form
      resetForm.reset(); // Clear the reset email input
    } catch (error: any) {
      console.error("Firebase Reset Password Error:", error);
      const errorMessage = error.message || "Failed to send password reset email.";
      toast({
        variant: "destructive",
        title: "Reset Password Failed",
        description: errorMessage.replace("Firebase: ", ""),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        {!showResetPasswordForm ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
              <CardDescription>Sign in to access your DocuSigner account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
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
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setShowResetPasswordForm(true);
                        signInForm.reset(); // Clear sign-in form if navigating away
                      }}
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <Button type="submit" className="w-full btn-gradient-hover" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                  </Button>
                </form>
              </Form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Reset Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={resetForm.control}
                    name="resetEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="pl-10"
                              disabled={isLoading}
                              autoFocus
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full btn-gradient-hover" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    <span>{isLoading ? "Sending Link..." : "Send Reset Link"}</span>
                  </Button>
                </form>
              </Form>
              <Button
                type="button"
                variant="link"
                className="mt-6 w-full text-sm text-muted-foreground hover:text-primary flex items-center"
                onClick={() => {
                  setShowResetPasswordForm(false);
                  resetForm.reset(); // Clear reset form if navigating away
                }}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Sign In
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>
  );
}
