
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

export interface TourStep {
  title: string;
  description: string;
  targetId: string | null; // ID of the element to highlight
}

interface ProductTourProps {
  steps: TourStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export function ProductTour({ steps, currentStepIndex, onNext, onPrev, onFinish }: ProductTourProps) {
  const currentStep = steps[currentStepIndex];
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);
  const [highlightStyle, setHighlightStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (currentStep && currentStep.targetId) {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        // Scroll element into view if not fully visible
        if (rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      } else {
        setTargetRect(null); // Target not found
      }
    } else {
      setTargetRect(null); // No target for this step (e.g., intro/outro)
    }
  }, [currentStep]);

  React.useEffect(() => {
    if (targetRect) {
      const padding = 10; // Padding around the highlighted element
      setHighlightStyle({
        position: 'fixed',
        left: `${targetRect.left - padding}px`,
        top: `${targetRect.top - padding}px`,
        width: `${targetRect.width + 2 * padding}px`,
        height: `${targetRect.height + 2 * padding}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)', // Overlay effect
        border: '2px solid hsl(var(--primary))',
        borderRadius: 'var(--radius)',
        pointerEvents: 'none',
        zIndex: 1000, // Ensure highlight is above most elements
        transition: 'all 0.3s ease-in-out',
      });
    } else {
      setHighlightStyle({});
    }
  }, [targetRect]);

  if (!currentStep) return null;

  const popoverPositionStyle: React.CSSProperties = {};
  if (targetRect) {
    // Attempt to position popover smartly based on targetRect
    if (targetRect.bottom + 250 < window.innerHeight) { // Space below?
      popoverPositionStyle.top = `${targetRect.bottom + 15}px`;
    } else if (targetRect.top - 250 > 0) { // Space above?
      popoverPositionStyle.bottom = `${window.innerHeight - targetRect.top + 15}px`;
    } else { // Default to center if no clear space
      popoverPositionStyle.top = '50%';
      popoverPositionStyle.transform = 'translateY(-50%)';
    }

    if (targetRect.left + targetRect.width / 2 < window.innerWidth / 2) { // Target on left?
      popoverPositionStyle.left = `${Math.max(15, targetRect.left)}px`;
    } else { // Target on right?
      popoverPositionStyle.right = `${Math.max(15, window.innerWidth - targetRect.right)}px`;
    }
  } else {
    // Centered for steps without a target
    popoverPositionStyle.left = '50%';
    popoverPositionStyle.top = '50%';
    popoverPositionStyle.transform = 'translate(-50%, -50%)';
  }


  return (
    <>
      {/* Overlay for steps that don't target a specific element (general intro/outro) */}
      {!currentStep.targetId && (
         <motion.div
          className="fixed inset-0 bg-black/50 z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Highlight for targeted elements */}
      {currentStep.targetId && targetRect && (
        <motion.div
          style={highlightStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.div
        className="fixed z-[1001] w-full max-w-sm"
        style={popoverPositionStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-2xl rounded-xl">
          <CardContent className="p-6 space-y-4 relative">
             <Button
                variant="ghost"
                size="icon"
                onClick={onFinish}
                className="absolute top-3 right-3 h-7 w-7"
                aria-label="Close tour"
            >
                <X className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-bold font-headline text-primary">{currentStep.title}</h3>
            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <div className="space-x-2">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={onPrev} size="sm">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>
                )}
                {currentStepIndex < steps.length - 1 ? (
                  <Button onClick={onNext} size="sm" className="btn-gradient-hover">
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={onFinish} size="sm" className="btn-gradient-hover">
                    Finish Tour
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
