
"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, XCircle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import type { Document } from '@/components/documents/DocumentCard';
import { summarizeDocument } from "@/ai/flows/summarize-document-flow"; // Import the AI flow
import { useToast } from "@/hooks/use-toast";


const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('uploadedDocuments');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredDocuments = (documents: Document[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('uploadedDocuments', JSON.stringify(documents));
  window.dispatchEvent(new CustomEvent('storage')); // Dispatch event for dashboard to potentially update
};


export function PdfUploader() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // Combined state for uploading and AI summary
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadedDocumentId, setLastUploadedDocumentId] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setErrorMessage(null);
    setLastUploadedDocumentId(null);

    if (fileRejections && fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        if (firstError.code === 'file-too-large') {
            setErrorMessage(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        } else if (firstError.code === 'file-invalid-type') {
            setErrorMessage("Invalid file type. Please upload a PDF file.");
        } else {
            setErrorMessage("File rejected. Please try another file.");
        }
        setUploadedFile(null);
        setUploadStatus("idle");
        return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadStatus("idle");
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  const handleUploadAndProcess = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setUploadStatus("processing");
    setUploadProgress(0);
    setErrorMessage(null);
    setLastUploadedDocumentId(null);

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total * 0.5); // Reading is 50%
        setUploadProgress(progress);
      }
    };

    reader.onloadend = async () => {
      try {
        setUploadProgress(50); // File reading complete
        const dataUrl = reader.result as string;
        const newDocumentId = Date.now().toString();
        
        let summary = "Could not generate summary.";
        try {
          toast({ title: "Generating AI Summary...", description: "Please wait."});
          const summaryResponse = await summarizeDocument({ documentName: uploadedFile.name });
          summary = summaryResponse.summary;
          setUploadProgress(75); // AI summary is another 25%
          toast({ title: "AI Summary Generated!", description: "Document processing complete."});
        } catch (aiError) {
          console.error("AI Summary Error:", aiError);
          toast({ variant: "destructive", title: "AI Summary Failed", description: "Could not generate document summary. Proceeding without it." });
        }

        const newDocument: Document = {
          id: newDocumentId,
          name: uploadedFile.name,
          status: "Uploaded",
          participants: ["Me"],
          lastModified: new Date().toISOString().split('T')[0],
          thumbnailUrl: '', 
          dataUrl: dataUrl,
          summary: summary, // Add the generated summary
        };

        const documents = getStoredDocuments();
        documents.unshift(newDocument); // Add to the beginning of the array
        saveStoredDocuments(documents);
        
        setUploadStatus("success");
        setLastUploadedDocumentId(newDocumentId);
        setUploadProgress(100); // Final 25% for saving
      } catch (e) {
        console.error("Error processing file or saving to localStorage:", e);
        setErrorMessage("Failed to process the file after upload.");
        setUploadStatus("error");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Could not read the file.");
      setUploadStatus("error");
      setIsProcessing(false);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMessage(null);
    setLastUploadedDocumentId(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.5 }}>
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl">
      <CardHeader className="text-center">
        <UploadCloud className="mx-auto h-16 w-16 text-primary mb-4" />
        <CardTitle className="text-3xl font-headline">Upload Your PDF Document</CardTitle>
        <CardDescription>Drag and drop your PDF file here or click to browse. An AI summary will be generated.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
              ${errorMessage ? 'border-red-500' : ''}
              `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
              {isDragActive ? (
                <p className="text-primary font-semibold">Drop the PDF here...</p>
              ) : (
                <p className="text-muted-foreground">Drag 'n' drop a PDF file here, or click to select file</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">PDF files only, up to {MAX_FILE_SIZE_MB}MB.</p>
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-medium truncate max-w-xs sm:max-w-md">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} disabled={isProcessing}>
                <XCircle className="h-5 w-5 text-red-500 hover:text-red-700" />
              </Button>
            </div>
            
            {(uploadStatus === "processing" || (uploadStatus === "success" && uploadProgress < 100)) && (
               <Progress value={uploadProgress} className="w-full h-2" />
            )}
             {uploadStatus === "success" && uploadProgress === 100 && !errorMessage && (
                 <Progress value={100} className="w-full h-2 [&>div]:bg-green-500" />
             )}

            <AnimatePresence>
            {uploadStatus === "success" && !errorMessage && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10}}
                    className="flex items-center text-green-600 p-3 bg-green-50 border border-green-200 rounded-md"
                >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <p>File uploaded and processed successfully!</p>
                </motion.div>
            )}
            {(uploadStatus === "error" || errorMessage) && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10}}
                    className="flex items-center text-red-600 p-3 bg-red-50 border border-red-200 rounded-md"
                >
                    <XCircle className="h-5 w-5 mr-2" />
                    <p>{errorMessage || "Upload failed. Please try again."}</p>
                </motion.div>
            )}
            </AnimatePresence>

            {uploadStatus !== "success" && !errorMessage && (
              <Button onClick={handleUploadAndProcess} className="w-full btn-gradient-hover" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>{uploadProgress < 50 ? `Reading File... (${uploadProgress * 2}%)` : uploadProgress < 75 ? `Generating Summary... (${(uploadProgress - 50) * 4}%)` : `Saving... (${(uploadProgress-75)*4}%)` }</span>
                  </>
                ) : (
                  <span>Upload and Process</span>
                )}
              </Button>
            )}
            {uploadStatus === "success" && lastUploadedDocumentId && !errorMessage && (
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Link href={`/documents/${lastUploadedDocumentId}/edit`}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Go to Document
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
