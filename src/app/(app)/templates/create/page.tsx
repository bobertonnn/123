
"use client";

import { TemplateCreator } from '@/components/templates/TemplateCreator';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, ArrowLeft } from 'lucide-react';
import type { UserSubscription } from "@/app/(app)/settings/page"; // Adjusted path

const FreeTrialRestrictionCard = () => (
  <Card className="shadow-xl rounded-2xl text-center max-w-2xl mx-auto my-10">
    <CardHeader>
      <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
      <CardTitle className="text-3xl font-headline">Template Creation is a Premium Feature</CardTitle>
      <CardDescription className="text-lg text-muted-foreground">
        To design and save new document templates, please upgrade your plan.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <p className="text-muted-foreground">
        Upgrading will unlock powerful template features, allowing you to save time and ensure consistency across your documents.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg" className="btn-gradient-hover">
          <Link href="/settings#billing">
            <CreditCard className="mr-2 h-5 w-5" />
            View Subscription Plans
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/templates">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Templates
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function CreateTemplatePage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSubscription = localStorage.getItem("userSubscription");
      if (storedSubscription) {
        try {
          const parsedSubscription: UserSubscription = JSON.parse(storedSubscription);
          setCurrentPlan(parsedSubscription.planName);
        } catch (e) {
          console.error("Failed to parse subscription from localStorage", e);
          setCurrentPlan("Free Trial"); 
        }
      } else {
        setCurrentPlan("Free Trial"); 
      }
      setIsLoadingPlan(false);
    }
  }, []);

  if (isLoadingPlan) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading template creation settings...</p>
      </div>
    );
  }

  if (currentPlan === "Free Trial") {
    return (
      <div className="container mx-auto py-8">
        <FreeTrialRestrictionCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TemplateCreator />
    </div>
  );
}
