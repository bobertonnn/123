
"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { name: string; isCompleted: boolean; isCurrent: boolean }[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={cn("flex items-center justify-center", className)}>
      <ol role="list" className="flex items-center space-x-0 sm:space-x-0.5">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn("flex items-center", stepIdx !== steps.length -1 ? "pr-0.5 sm:pr-1" : "")}>
            {step.isCompleted ? (
              <>
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="ml-1 text-xs font-medium text-primary line-clamp-1">{step.name}</span>
              </>
            ) : step.isCurrent ? (
              <>
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                  <span className="text-primary font-semibold text-[9px] sm:text-[10px]">{stepIdx + 1}</span>
                </div>
                <span className="ml-1 text-xs font-medium text-primary line-clamp-1">{step.name}</span>
              </>
            ) : (
              <>
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-border">
                   <span className="text-muted-foreground font-semibold text-[9px] sm:text-[10px]">{stepIdx + 1}</span>
                </div>
                <span className="ml-1 text-xs font-medium text-muted-foreground line-clamp-1">{step.name}</span>
              </>
            )}

            {stepIdx !== steps.length - 1 && (
              <div className="h-0.5 w-3 sm:w-4 bg-border ml-1 sm:ml-1.5" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
