
"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, CheckCircle, Home, Share2, AlertTriangle, Terminal, Phone, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinalizedDocumentData {
  documentId: string;
  finalizedPdfDataUri: string; 
  signatureUrl: string | null;
  documentName: string;
  phoneNumber?: string | null; 
  companyName?: string | null; 
}

export default function DocumentSignedPage() {
  const router = useRouter();
  const [finalizedData, setFinalizedData] = useState<FinalizedDocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dataProcessedRef = useRef(false);
  const signatureBlobUrlToRevokeRef = useRef<string | null>(null);

  useEffect(() => {
    if (dataProcessedRef.current) {
      return;
    }
    dataProcessedRef.current = true;

    const dataStr = localStorage.getItem('finalizedDocumentData');
    localStorage.removeItem('finalizedDocumentData'); 

    if (dataStr) {
      try {
        const data: FinalizedDocumentData = JSON.parse(dataStr);
        setFinalizedData(data);
        if (data.signatureUrl && data.signatureUrl.startsWith('blob:')) {
            signatureBlobUrlToRevokeRef.current = data.signatureUrl;
        }
      } catch (e) {
        console.error("Error parsing finalized document data:", e);
        setError("Could not load document confirmation details. The data might be corrupted or missing.");
      }
    } else {
      setError("No finalized document data found. Please ensure the document was finalized correctly or try signing again.");
    }

    return () => {
      if (signatureBlobUrlToRevokeRef.current) {
        URL.revokeObjectURL(signatureBlobUrlToRevokeRef.current);
        signatureBlobUrlToRevokeRef.current = null;
      }
    };
  }, []); 

  const handleDownload = () => {
    if (finalizedData?.finalizedPdfDataUri) {
      const link = document.createElement('a');
      link.href = finalizedData.finalizedPdfDataUri;
      link.download = `signed-${finalizedData.documentName || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-lg shadow-xl rounded-2xl border-destructive/50">
            <CardHeader className="bg-destructive/10">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
                <CardTitle className="text-2xl font-headline text-destructive">Operation Failed</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground mb-6">{error}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!finalizedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
        <p className="text-lg animate-pulse">Loading confirmation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-center"
      >
        <div className="mb-6">
          <span className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
            {finalizedData.documentName || 'document.pdf'}
          </span>
        </div>

        {finalizedData.signatureUrl && (
          <motion.div
            className="mb-8 perspective"
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            <Card className="bg-gray-700 border-gray-600 shadow-2xl inline-block transform transition-transform duration-300 hover:scale-105 rounded-xl">
              <CardContent className="p-6 md:p-10">
                <Image
                  src={finalizedData.signatureUrl}
                  alt="Your Signature"
                  width={300}
                  height={150}
                  className="bg-gray-600 rounded-md shadow-inner"
                  data-ai-hint="signature image"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.h1 
            className="text-4xl font-bold mb-3 font-headline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            Document Signed
        </motion.h1>
        <motion.p 
            className="text-green-400 flex items-center justify-center mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
          <CheckCircle className="mr-2 h-5 w-5" /> Your details have been added to the document.
        </motion.p>

        {(finalizedData.companyName || finalizedData.phoneNumber) && (
          <motion.div
            className="text-gray-400 mb-4 text-sm space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            {finalizedData.companyName && (
              <p className="flex items-center justify-center">
                <Building className="mr-2 h-4 w-4" /> Company: {finalizedData.companyName}
              </p>
            )}
            {finalizedData.phoneNumber && (
              <p className="flex items-center justify-center">
                <Phone className="mr-2 h-4 w-4" /> Phone: {finalizedData.phoneNumber}
              </p>
            )}
          </motion.div>
        )}

        <motion.p 
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
          You can now download the finalized document. 
          Check the PDF certificate page (usually the last page) for information regarding watermarks and device verification.
        </motion.p>

        <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button 
            variant="outline" 
            className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white"
            disabled // Placeholder for future feature
          >
            <Share2 className="mr-2 h-4 w-4" /> Share Confirmation
          </Button>
          <Button onClick={handleDownload} className="bg-green-500 hover:bg-green-600 text-white">
            <Download className="mr-2 h-4 w-4" /> Download Document
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-4"
        >
          <Link href="/dashboard" className="text-green-400 hover:underline">
            Go Back to Dashboard
          </Link>
        </motion.div>

      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .perspective > div { /* The Card */
          transform-style: preserve-3d;
        }
        pre {
          font-family: var(--font-code), monospace; 
        }
      `}</style>
    </div>
  );
}
