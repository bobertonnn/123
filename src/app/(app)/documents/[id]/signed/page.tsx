
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
  finalizedPdfDataUri: string; 
  signatureUrl: string | null;
  documentName: string;
  phoneNumber?: string | null; // Added
  companyName?: string | null; // Added
}

export default function DocumentSignedPage() {
  const router = useRouter();
  const params = useParams();
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
        setError("Could not load document confirmation details.");
      }
    } else {
      setError("No finalized document data found. Please ensure the document was finalized correctly.");
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

  const exampleCommands = {
    windows: "echo 'Conceptual device verification command for Windows.'\nrem Example: verify-docusigner-device.exe --token YOUR_SECURE_TOKEN",
    macos: "echo 'Conceptual device verification command for macOS.'\n# Example: ./verify-docusigner-device-mac --token YOUR_SECURE_TOKEN",
    linux: "echo 'Conceptual device verification command for Linux.'\n# Example: docusigner-auth verify-device --key YOUR_API_KEY",
  };
  const [currentOs, setCurrentOs] = useState<'windows' | 'macos' | 'linux'>('windows');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) setCurrentOs('macos');
      else if (navigator.platform.toUpperCase().indexOf('LINUX') >= 0) setCurrentOs('linux');
      else setCurrentOs('windows');
    }
  }, []);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!finalizedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <p className="text-lg">Loading confirmation...</p>
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
          <CheckCircle className="mr-2 h-5 w-5" /> Your details have been added.
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-2xl mt-8"
      >
        <Card className="bg-gray-700/80 border-yellow-500/50 shadow-lg rounded-xl backdrop-blur-sm">
          <CardHeader className="flex-row items-center gap-3 pb-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <CardTitle className="text-xl font-headline text-yellow-300">Watermark Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-300 space-y-3">
            <p>
              Please note: This document has been finalized with a "DOCUSIGNER PREVIEW" watermark on each page.
            </p>
            <p>
              To verify your device for enhanced security or to explore advanced features (like watermark-free documents with a premium plan), you might be guided to use a command in your terminal or PowerShell. Below are conceptual examples of what such verification steps might look like:
            </p>
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-200 flex items-center"><Terminal className="mr-2 h-5 w-5"/> Conceptual Device Verification</h4>
                <div className="flex gap-1">
                    <Button size="xs" variant={currentOs === 'windows' ? 'secondary' : 'ghost'} onClick={() => setCurrentOs('windows')} className="text-xs px-2 py-0.5 h-auto">Win</Button>
                    <Button size="xs" variant={currentOs === 'macos' ? 'secondary' : 'ghost'} onClick={() => setCurrentOs('macos')} className="text-xs px-2 py-0.5 h-auto">Mac</Button>
                    <Button size="xs" variant={currentOs === 'linux' ? 'secondary' : 'ghost'} onClick={() => setCurrentOs('linux')} className="text-xs px-2 py-0.5 h-auto">Lin</Button>
                </div>
              </div>
              <pre className="bg-black/50 p-3 rounded-md text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap">
                <code>{exampleCommands[currentOs]}</code>
              </pre>
              <p className="text-xs text-yellow-400/80 mt-2">
                <strong className="font-medium">Disclaimer:</strong> The command above is a conceptual example for device verification or accessing advanced features. It does not directly remove the embedded watermark. Watermark-free documents are typically a benefit of premium services.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8"
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

    
