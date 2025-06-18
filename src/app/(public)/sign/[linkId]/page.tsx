
"use client";

import { PdfViewer } from '@/components/documents/PdfViewer';
import { SignatureCanvas } from '@/components/auth/SignatureCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, FileText, ArrowLeft, ArrowRight, User, CalendarDays, PenTool, PartyPopper } from 'lucide-react'; // Added PartyPopper
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { format } from 'date-fns';

interface SigningField {
  id: string;
  type: 'fullName' | 'date' | 'signature';
  label: string;
  required: boolean;
  icon: React.ElementType;
}

const mockSigningFields: SigningField[] = [
  { id: 'f1', type: 'fullName', label: 'Full Name', required: true, icon: User },
  { id: 'f2', type: 'date', label: 'Date', required: true, icon: CalendarDays },
  { id: 'f3', type: 'signature', label: 'Signature', required: true, icon: PenTool },
];

interface FormData {
  fullName: string;
  date: string;
  signatureDataUrl: string | null;
}

const sheetStepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const ConfettiParticle = ({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) => (
  <motion.div
    className="absolute w-2 h-4"
    style={{ x, y, rotate, backgroundColor: color, originX: 0.5, originY: 0.5 }}
    initial={{ opacity: 1, y: 0, scale:1 }}
    animate={{ opacity: 0, y: 100 + Math.random() * 50, scale: 0.5, rotate: rotate + Math.random() * 180 - 90 }}
    transition={{ duration: 1 + Math.random() * 1, ease: "easeOut" }}
  />
);


export default function PublicSignPage({ params }: { params: { linkId: string } }) {
  const { linkId } = params;
  const [isSigned, setIsSigned] = useState(false);
  const [isSigningSheetOpen, setIsSigningSheetOpen] = useState(false);
  const [currentFieldStep, setCurrentFieldStep] = useState(0);
  const [direction, setDirection] = useState(0); // For animation direction

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    signatureDataUrl: null,
  });

  const [confettiPieces, setConfettiPieces] = useState<JSX.Element[]>([]);

  const documentName = `Contract ${linkId.substring(0,5)}`;
  const requesterName = "Acme Corp";

  const currentField = mockSigningFields[currentFieldStep];
  const Icon = currentField?.icon;

  const handleNextField = () => {
    if (currentFieldStep < mockSigningFields.length - 1) {
      setDirection(1);
      setCurrentFieldStep(currentFieldStep + 1);
    }
  };

  const handlePreviousField = () => {
    if (currentFieldStep > 0) {
      setDirection(-1);
      setCurrentFieldStep(currentFieldStep - 1);
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignatureSave = (dataUrl: string) => { // dataUrl is now transparent PNG
    setFormData({ ...formData, signatureDataUrl: dataUrl });
  };

  const isCurrentFieldFilled = () => {
    if (!currentField) return false;
    if (!currentField.required) return true;

    switch (currentField.type) {
      case 'fullName':
        return formData.fullName.trim() !== '';
      case 'date':
        return formData.date.trim() !== '';
      case 'signature':
        return formData.signatureDataUrl !== null;
      default:
        const exhaustiveCheck: never = currentField.type;
        return false;
    }
  };

  const areAllRequiredFieldsFilled = () => {
    return mockSigningFields.every(field => {
      if (!field.required) return true;
      switch (field.type) {
        case 'fullName':
          return formData.fullName.trim() !== '';
        case 'date':
          return formData.date.trim() !== '';
        case 'signature':
          return formData.signatureDataUrl !== null;
        default:
          const exhaustiveCheck: never = field.type;
          return false;
      }
    });
  };

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 50 }).map((_, i) => {
        const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--foreground))"];
        return (
            <ConfettiParticle
                key={i}
                x={Math.random() * 200 - 100} // Spread around center
                y={Math.random() * -50}      // Start slightly above
                rotate={Math.random() * 360}
                color={colors[Math.floor(Math.random() * colors.length)]}
            />
        );
    });
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 3000); // Clear confetti after animation
  };


  const handleSubmitSignature = () => {
    if (!areAllRequiredFieldsFilled()) {
      alert("Please fill all required fields.");
      return;
    }
    console.log(`Signature process for document ${linkId} completed.`);
    console.log("Form Data:", formData); // formData.signatureDataUrl is now transparent
    setIsSigned(true);
    setIsSigningSheetOpen(false);
    triggerConfetti();
  };

  useEffect(() => {
    if (isSigningSheetOpen) {
      setFormData(prev => ({
        ...prev,
        date: prev.date || format(new Date(), 'yyyy-MM-dd')
      }));
    }
  }, [isSigningSheetOpen]);

  if (isSigned) {
    return (
      <motion.div
        initial={{ opacity: 0, scale:0.8 }}
        animate={{ opacity: 1, scale:1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className="relative" // For confetti positioning
      >
        <Card className="w-full max-w-xl text-center shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-primary/10 p-8">
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay: 0.2, duration: 0.4, type: 'spring', bounce: 0.5}}>
                <PartyPopper className="mx-auto h-20 w-20 text-primary mb-4" />
            </motion.div>
            <CardTitle className="text-3xl font-headline text-primary">Document Signed Successfully!</CardTitle>
            <CardDescription className="text-muted-foreground text-md">
              Thank you for signing "{documentName}". {requesterName} has been notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-muted-foreground">You can now close this window.</p>
             <Button asChild className="mt-6 btn-gradient-hover">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-1/2 pointer-events-none">
            {confettiPieces}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl">
      <Card className="w-full shadow-xl rounded-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary"/>
              <div>
                  <CardTitle className="text-2xl font-headline">You're Invited to Sign</CardTitle>
                  <CardDescription>
                  {requesterName} has requested your signature on: <strong>{documentName}</strong>
                  </CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[600px] overflow-y-auto rounded-lg border bg-muted">
            <PdfViewer fileUrl={`https://placehold.co/800x1100.png?text=Document+${linkId}`} />
          </div>
          <div className="md:col-span-1 flex flex-col justify-center items-center space-y-6 p-4 bg-card rounded-lg border shadow-sm">
            <PenTool className="h-16 w-16 text-primary" />
            <h3 className="text-xl font-semibold text-center font-headline">Ready to Sign?</h3>
            <p className="text-sm text-muted-foreground text-center">
              Click the button below to start the guided signing process.
            </p>
            <Button
              onClick={() => { setCurrentFieldStep(0); setDirection(0); setIsSigningSheetOpen(true); }}
              className="w-full btn-gradient-hover"
              size="lg"
            >
              <CheckCircle className="mr-2 h-5 w-5" /> <span>Begin Signing Process</span>
            </Button>
             <p className="text-xs text-muted-foreground text-center">
                By signing, you agree to be legally bound by this document.
            </p>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSigningSheetOpen} onOpenChange={setIsSigningSheetOpen}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col overflow-hidden"> {/* Added overflow-hidden */}
          <SheetHeader className="p-6 border-b shrink-0"> {/* Added shrink-0 */}
            <SheetTitle className="text-2xl font-headline flex items-center">
                {currentField?.icon && <currentField.icon className="mr-3 h-6 w-6 text-primary" />}
                {currentField?.label || "Signing Process"}
            </SheetTitle>
            <SheetDescription>
              Please complete the field below. Document: {documentName}. Step {currentFieldStep + 1} of {mockSigningFields.length}.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto relative"> {/* Added relative for AnimatePresence */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentFieldStep}
                custom={direction}
                variants={sheetStepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full" // Ensure div takes full width for proper animation
              >
                {currentField?.type === 'fullName' && (
                  <div>
                    <Label htmlFor="fullNameInput" className="text-base">Your Full Name</Label>
                    <Input
                      id="fullNameInput"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormInputChange}
                      placeholder="Enter your full legal name"
                      className="mt-1 text-base py-3"
                      required={currentField.required}
                      autoFocus
                    />
                  </div>
                )}
                {currentField?.type === 'date' && (
                  <div>
                    <Label htmlFor="dateInput" className="text-base">Date of Signing</Label>
                    <Input
                      id="dateInput"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleFormInputChange}
                      className="mt-1 text-base py-3"
                      required={currentField.required}
                      autoFocus
                    />
                  </div>
                )}
                {currentField?.type === 'signature' && (
                  <div className="flex flex-col items-center">
                    <Label className="text-base mb-2 self-start">Your Signature</Label>
                    <SignatureCanvas
                      onSave={handleSignatureSave}
                      width={320}
                      height={160}
                      backgroundColor="transparent"
                      penColor="hsl(var(--foreground))"
                    />
                    {formData.signatureDataUrl && <CheckCircle className="text-green-500 mt-2 h-5 w-5" title="Signature captured"/>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <SheetFooter className="p-6 border-t mt-auto shrink-0"> {/* Added shrink-0 */}
            <div className="flex w-full justify-between items-center">
              <Button variant="outline" onClick={handlePreviousField} disabled={currentFieldStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {currentFieldStep < mockSigningFields.length - 1 ? (
                <Button
                  onClick={handleNextField}
                  className="btn-gradient-hover"
                  disabled={!isCurrentFieldFilled()}
                >
                  Next Field <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitSignature}
                  className="btn-gradient-hover"
                  disabled={!areAllRequiredFieldsFilled()}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Complete Signing</span>
                </Button>
              )}
            </div>
             <SheetClose asChild className="mt-4 w-full">
                <Button variant="ghost" className="text-muted-foreground">Cancel Signing</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}

