
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, CalendarDays, Type, CheckSquare, Users, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"; // Added for consistency if needed
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // For selection

const fieldTypes = [
  { name: "Signature", icon: PenTool, description: "Add a signature field" },
  { name: "Date", icon: CalendarDays, description: "Add a date field" },
  { name: "Text", icon: Type, description: "Add a text input field" },
  { name: "Initials", icon: Type, description: "Add an initials field (smaller text)" },
  { name: "Checkbox", icon: CheckSquare, description: "Add a checkbox" },
  { name: "Comment", icon: Type, description: "Add a comment box" },
];

interface Signer {
  id: string;
  name: string;
}

const mockSigners: Signer[] = [
  { id: "signer1", name: "Alice Wonderland" },
  { id: "signer2", name: "Bob The Builder" },
  { id: "signer3", name: "Charlie Brown" },
  { id: "currentUser", name: "Me (Current User)" },
];

export function FieldPalette() {
  const { toast } = useToast();
  const [selectedSigner, setSelectedSigner] = useState<Signer | null>(null);
  const [isSignerDialogOpen, setIsSignerDialogOpen] = useState(false);

  const handleAddField = (fieldName: string) => {
    const signerInfo = selectedSigner ? ` for ${selectedSigner.name}` : "";
    toast({
      title: "Add Field",
      description: `${fieldName} field added${signerInfo} to document (mock). Full drag & drop TBD.`,
    });
  };

  const handleSignerSelect = (signerId: string) => {
    const signer = mockSigners.find(s => s.id === signerId);
    if (signer) {
      setSelectedSigner(signer);
    }
    setIsSignerDialogOpen(false);
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-xl font-headline">
          <Palette className="mr-2 h-6 w-6 text-primary" />
          Add Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="mb-4">
            <p className="text-sm font-medium mb-1">Assign to:</p>
            <Dialog open={isSignerDialogOpen} onOpenChange={setIsSignerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    {selectedSigner ? selectedSigner.name : "Select Signer..."}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline">Select Signer</DialogTitle>
                  <DialogDescription>
                    Choose who this field will be assigned to.
                  </DialogDescription>
                </DialogHeader>
                <RadioGroup 
                    value={selectedSigner?.id} 
                    onValueChange={handleSignerSelect}
                    className="space-y-2 py-4"
                >
                  {mockSigners.map((signer) => (
                    <Label 
                        key={signer.id} 
                        htmlFor={`signer-${signer.id}`} 
                        className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                    >
                      <RadioGroupItem value={signer.id} id={`signer-${signer.id}`} />
                      <span>{signer.name}</span>
                    </Label>
                  ))}
                </RadioGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
        {fieldTypes.map((field, index) => {
          const Icon = field.icon;
          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start py-6 text-left h-auto hover:bg-accent hover:border-primary transition-all group"
                onClick={() => handleAddField(field.name)}
                title={`Click to add ${field.name.toLowerCase()} field (mock)`}
                disabled={!selectedSigner && (field.name === "Signature" || field.name === "Initials" || field.name === "Date")} // Example: Disable if no signer and field requires one
              >
                <Icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                    <span className="font-medium">{field.name}</span>
                    <p className="text-xs text-muted-foreground group-hover:text-accent-foreground transition-colors">{field.description}</p>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
