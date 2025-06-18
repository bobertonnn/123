
"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, XCircle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import type { Document } from '@/components/documents/DocumentCard'; // Assuming Document type is exported

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Helper to get documents from localStorage
const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('uploadedDocuments');
  return stored ? JSON.parse(stored) : [];
};

// Helper to save documents to localStorage
const saveStoredDocuments = (documents: Document[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('uploadedDocuments', JSON.stringify(documents));
};


export function PdfUploader() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadedDocumentId, setLastUploadedDocumentId] = useState<string | null>(null);

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

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage(null);
    setLastUploadedDocumentId(null);

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      }
    };
    reader.onloadend = () => {
      // Simulate network delay for upload
      setTimeout(() => {
        try {
          const dataUrl = reader.result as string;
          const newDocumentId = Date.now().toString();
          const newDocument: Document = {
            id: newDocumentId,
            name: uploadedFile.name,
            status: "Uploaded", // Or 'Pending' if it needs processing
            participants: ["Me"], // Example participant
            lastModified: new Date().toISOString().split('T')[0],
            thumbnailUrl: '', // We don't generate thumbnails client-side
            // Add actual file data if needed for viewing, e.g., dataUrl for client-side storage
            // fileSize: uploadedFile.size, // You might want to store size
            dataUrl: dataUrl, // Storing the data URL
          };

          const documents = getStoredDocuments();
          documents.push(newDocument);
          saveStoredDocuments(documents);
          
          setUploadStatus("success");
          setLastUploadedDocumentId(newDocumentId);
          setIsUploading(false);
          setUploadProgress(100);
        } catch (e) {
          console.error("Error processing file or saving to localStorage:", e);
          setErrorMessage("Failed to process the file after upload.");
          setUploadStatus("error");
          setIsUploading(false);
        }
      }, 1500); // Simulate 1.5s upload
    };
    reader.onerror = () => {
      setErrorMessage("Could not read the file.");
      setUploadStatus("error");
      setIsUploading(false);
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
        <CardDescription>Drag and drop your PDF file here or click to browse.</CardDescription>
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
              <Button variant="ghost" size="icon" onClick={removeFile} disabled={isUploading}>
                <XCircle className="h-5 w-5 text-red-500 hover:text-red-700" />
              </Button>
            </div>
            
            {(uploadStatus === "uploading" || (uploadStatus === "success" && uploadProgress < 100)) && (
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
                    <p>File uploaded successfully!</p>
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
              <Button onClick={handleUpload} className="w-full btn-gradient-hover" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Uploading... ({uploadProgress}%)</span>
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

interface Document {
  id: string;
  name: string;
  status: "Pending" | "Signed" | "Completed" | "Rejected" | "Uploaded";
  participants: string[];
  lastModified: string;
  thumbnailUrl?: string;
  dataUrl?: string; // Added to store PDF data
}

    