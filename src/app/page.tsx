"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { validateSubmission } from "@/ai/flows/validate-submission";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

type ValidationStatus = "idle" | "loading" | "valid" | "invalid" | "error";

export default function NullVoidPage() {
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [message, setMessage] = useState<string>("Enter text and click Validate.");
  const [aiValidationResult, setAiValidationResult] = useState<boolean | null>(null);
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Loading" />;
      case "valid":
        return <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Valid input" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-destructive" aria-label="Invalid input" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" aria-label="Error" />;
      case "idle":
      default:
        return <HelpCircle className="h-5 w-5 text-muted-foreground" aria-label="Idle status" />;
    }
  };

  const handleValidate = async () => {
    setStatus("loading");
    setMessage("Validating your input...");
    setAiValidationResult(null);

    try {
      const result = await validateSubmission({ text });
      setAiValidationResult(result.isValid);
      if (result.isValid) {
        setStatus("valid");
        setMessage("Input is valid and ready for submission.");
      } else {
        setStatus("invalid");
        setMessage("Input cannot be empty. Submission is disabled.");
      }
    } catch (error) {
      console.error("Validation AI error:", error);
      setStatus("error");
      setMessage("Could not validate input. Please try again.");
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "An error occurred while trying to validate your input. Please check your connection or try again later.",
      });
      setAiValidationResult(null); // Ensure button is not disabled due to a previous invalid state after a service error
    }
  };

  const isButtonDisabled = status === "loading" || (status === "invalid" && aiValidationResult === false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background selection:bg-primary/20 selection:text-primary">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center text-primary">NullVoid Validator</CardTitle>
          <CardDescription className="text-center">
            Enter text below to check if it's empty or not using our advanced AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text-input" className="font-medium text-sm text-foreground">Your Text</label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something here..."
              className="min-h-[120px] text-base focus:ring-2 focus:ring-primary"
              aria-label="Text input for validation"
            />
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md min-h-[50px]">
            <div aria-hidden="true">{getStatusIcon()}</div>
            <p className="text-sm text-foreground" aria-live="polite">
              {message}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleValidate}
            disabled={isButtonDisabled}
            className="w-full text-lg py-6 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            aria-label="Validate input text"
          >
            {status === "loading" ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {status === "loading" ? "Validating..." : "Validate Text"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
