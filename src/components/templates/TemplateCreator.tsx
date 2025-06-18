"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PdfUploader } from '@/components/documents/PdfUploader'; // Re-use for base PDF
import { FieldPalette } from '@/components/documents/FieldPalette'; // Re-use for placing fields
import { PdfViewer } from '@/components/documents/PdfViewer'; // Re-use for preview
import { FileText, Users, Save, PlusCircle, Trash2, Edit3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

interface SignerRole {
  id: string;
  name: string;
  emailPlaceholder?: string; // e.g., "Client Email"
}

export function TemplateCreator() {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [basePdfFile, setBasePdfFile] = useState<File | null>(null); // If templates are based on an uploaded PDF
  const [signerRoles, setSignerRoles] = useState<SignerRole[]>([{ id: Date.now().toString(), name: "Signer 1" }]);

  const handleAddRole = () => {
    setSignerRoles([...signerRoles, { id: Date.now().toString(), name: `Signer ${signerRoles.length + 1}` }]);
  };

  const handleRemoveRole = (id: string) => {
    setSignerRoles(signerRoles.filter(role => role.id !== id));
  };

  const handleRoleNameChange = (id: string, newName: string) => {
    setSignerRoles(signerRoles.map(role => role.id === id ? { ...role, name: newName } : role));
  };

  const handleSaveTemplate = () => {
    console.log("Saving template:", { templateName, templateDescription, basePdfFile, signerRoles /*, fieldPlacements */ });
    // API call to save template
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="space-y-8"
    >
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" /> Create New Document Template
          </CardTitle>
          <CardDescription>
            Design reusable templates with predefined fields and signer roles to streamline your document workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="templateName" className="text-lg font-medium">Template Name</Label>
            <Input 
              id="templateName" 
              placeholder="e.g., Standard Non-Disclosure Agreement" 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="mt-1 text-base py-3 px-4"
            />
          </div>
          <div>
            <Label htmlFor="templateDescription" className="text-lg font-medium">Description (Optional)</Label>
            <Textarea
              id="templateDescription"
              placeholder="A brief description of this template's purpose."
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              className="mt-1 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Upload Base PDF (Optional, could also be a blank canvas type template) */}
      {/* For now, let's assume templates are PDF-based */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
            <CardTitle className="text-xl font-headline">Base Document (PDF)</CardTitle>
            <CardDescription>Upload the PDF that will serve as the foundation for this template.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Minimal version of PdfUploader logic integrated here or use the component */}
            <Input type="file" accept=".pdf" onChange={(e) => setBasePdfFile(e.target.files ? e.target.files[0] : null)} />
            {basePdfFile && <p className="mt-2 text-sm text-green-600">Selected: {basePdfFile.name}</p>}
        </CardContent>
      </Card>


      {/* Step 3: Define Signer Roles */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" /> Signer Roles
          </CardTitle>
          <CardDescription>Define the roles for participants who will sign or fill this document.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {signerRoles.map((role, index) => (
            <motion.div 
                key={role.id} 
                className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/20"
                initial={{ opacity: 0, y:10 }}
                animate={{ opacity: 1, y:0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="font-medium text-sm text-primary p-2 bg-primary/10 rounded-full aspect-square flex items-center justify-center h-8 w-8">{index + 1}</span>
              <Input 
                placeholder={`e.g., Client, Employee, Manager`}
                value={role.name}
                onChange={(e) => handleRoleNameChange(role.id, e.target.value)}
                className="flex-grow"
              />
              <Input 
                placeholder={`Email Placeholder (Optional)`}
                value={role.emailPlaceholder || ''}
                onChange={(e) => setSignerRoles(signerRoles.map(r => r.id === role.id ? {...r, emailPlaceholder: e.target.value} : r))}
                className="flex-grow"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveRole(role.id)} disabled={signerRoles.length <= 1}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </motion.div>
          ))}
          <Button variant="outline" onClick={handleAddRole} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </CardContent>
      </Card>

      {/* Step 4: Place Fields (Simplified: shows palette and placeholder viewer) */}
       <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <Edit3 className="mr-2 h-6 w-6 text-primary" /> Template Editor
          </CardTitle>
          <CardDescription>Drag and drop fields onto the document for each role.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row gap-6 min-h-[500px]">
                <div className="md:w-1/3 lg:w-1/4">
                    <FieldPalette />
                </div>
                <div className="flex-1 bg-muted rounded-lg p-4">
                     <PdfViewer fileUrl={basePdfFile ? URL.createObjectURL(basePdfFile) : undefined} />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <CardFooter className="flex justify-end p-0 pt-6">
        <Button size="lg" onClick={handleSaveTemplate} className="btn-gradient-hover">
          <Save className="mr-2 h-5 w-5" /> <span>Save Template</span>
        </Button>
      </CardFooter>
    </motion.div>
  );
}
