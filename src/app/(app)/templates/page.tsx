
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, PlusCircle, Edit, Trash2, Search, AlertTriangle, CreditCard } from "lucide-react"; // Removed ArrowRight
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { UserSubscription } from "@/app/(app)/settings/page";

// Removed mockTemplates array

const FreeTrialRestrictionCard = () => (
  <Card className="shadow-xl rounded-2xl text-center max-w-2xl mx-auto my-10">
    <CardHeader>
      <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
      <CardTitle className="text-3xl font-headline">Templates are a Premium Feature</CardTitle>
      <CardDescription className="text-lg text-muted-foreground">
        To create, manage, and use document templates, please upgrade your plan.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-6">
        Upgrade to a paid plan to unlock powerful template features, save time, and streamline your workflows.
      </p>
      <Button asChild size="lg" className="btn-gradient-hover">
        <Link href="/settings#billing">
          <CreditCard className="mr-2 h-5 w-5" />
          View Subscription Plans
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default function TemplatesPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const { toast } = useToast(); // toast might be used for future actions like delete

  // Placeholder for actual templates - this would come from localStorage or API
  const [userTemplates, setUserTemplates] = useState<Array<{id: string, name: string, description: string, lastModified: string}>>([]);

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

      // TODO: Load actual user templates from localStorage or API when implemented
      // For now, it will be an empty array, demonstrating the "No Templates Yet" state.
      // const loadedTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]');
      // setUserTemplates(loadedTemplates);
    }
  }, []);

  if (isLoadingPlan) {
    return (
      <div className="container mx-auto text-center py-20">
        <p>Loading template settings...</p>
      </div>
    );
  }

  if (currentPlan === "Free Trial") {
    return (
      <div className="container mx-auto py-8">
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold font-headline">Document Templates</h1>
        </div>
        <FreeTrialRestrictionCard />
      </div>
    );
  }

  // TODO: Implement handleDeleteTemplate function
  // const handleDeleteTemplate = (templateId: string) => {
  //   setUserTemplates(prev => prev.filter(t => t.id !== templateId));
  //   // Update localStorage/API
  //   toast({ title: "Template Deleted", description: "The template has been removed."});
  // };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Document Templates</h1>
        <Button asChild className="btn-gradient-hover">
          <Link href="/templates/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Create New Template</span>
          </Link>
        </Button>
      </div>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-8" />
        </div>
      </div>

      {userTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
            <Card className="flex flex-col h-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg font-headline">{template.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground h-12 overflow-hidden text-ellipsis">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-xs text-muted-foreground">Last Modified: {template.lastModified}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/templates/${template.id}/edit`}> {/* TODO: Implement edit page */}
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" className="flex-1"> {/* onClick={() => handleDeleteTemplate(template.id)} */}
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-card rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Templates Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first template to speed up document preparation.
          </p>
          <Button className="mt-6 btn-gradient-hover" asChild>
            <Link href="/templates/create">
              <PlusCircle className="mr-2 h-4 w-4" /> <span>Create Template</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
