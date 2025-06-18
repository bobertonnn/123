
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
import { Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase"; // Import Firebase auth
import { signInWithEmailAndPassword, type User as FirebaseUser } from "firebase/auth";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        if (!user.emailVerified) {
          toast({
            title: "Email Not Verified",
            description: "Please verify your email address by clicking the link sent to your inbox. Some features may be limited.",
            variant: "default", // Or "destructive" if you want to be more stern
            duration: 7000,
          });
        } else {
            toast({
                title: "Sign In Successful!",
                description: `Welcome back, ${user.displayName || user.email}!`,
            });
        }
        
        // Store essential user info. In a real app, manage this with onAuthStateChanged listener.
        localStorage.setItem("userUID", user.uid);
        if (user.displayName) localStorage.setItem("userFullName", user.displayName);
        if (user.email) localStorage.setItem("userEmail", user.email);
        // Signature would typically be fetched from Firestore if stored there, or use existing localStorage if available
        // For now, we assume sign-up flow handles signature in localStorage.

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your DocuSigner account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
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
                control={form.control}
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
      </Card>
    </motion.div>
  );
}
