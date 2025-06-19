
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertTriangle, Terminal, ShieldAlert, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VerifyDevicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const documentId = params.documentId as string;
  const documentName = searchParams.get('docName') || "this document";

  const [currentOs, setCurrentOs] = useState<'windows' | 'macos' | 'linux'>('windows');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) setCurrentOs('macos');
      else if (navigator.platform.toUpperCase().indexOf('LINUX') >= 0) setCurrentOs('linux');
      else setCurrentOs('windows');
    }
  }, []);

  const exampleCommands = {
    windows: `echo 'Conceptual device verification command for Windows for document: ${documentName} (ID: ${documentId})'\nrem Example: verify-docusigner-device.exe --token YOUR_SECURE_TOKEN --docId ${documentId}`,
    macos: `echo 'Conceptual device verification command for macOS for document: ${documentName} (ID: ${documentId})'\n# Example: ./verify-docusigner-device-mac --token YOUR_SECURE_TOKEN --docId ${documentId}`,
    linux: `echo 'Conceptual device verification command for Linux for document: ${documentName} (ID: ${documentId})'\n# Example: docusigner-auth verify-device --key YOUR_API_KEY --docId ${documentId}`,
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-card border-b p-6">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl md:text-3xl font-headline text-foreground">
                  Device & Feature Status
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Information regarding document: <strong>{documentName}</strong>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
              <p className="font-semibold text-destructive-foreground">
                Device Verification Not Confirmed
              </p>
              <p className="text-xs text-destructive-foreground/80">
                We cannot currently confirm device verification for advanced features (like watermark-free documents with a premium plan) for this document instance.
              </p>
            </div>
            
            <div className="p-4 border border-border rounded-lg bg-background shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-foreground flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2"/> Watermark Information
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Please note: This document has been finalized with a "DOCUSIGNER PREVIEW" watermark on each page.
                </p>
                <p className="text-sm text-muted-foreground">
                  To verify your device for enhanced security or to explore advanced features (like watermark-free documents with a premium plan), you might be guided to use a command in your terminal or PowerShell. Below are conceptual examples of what such verification steps might look like:
                </p>
                <div className="mt-4 p-4 bg-black/5 rounded-lg dark:bg-black/30">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-foreground/90 text-sm flex items-center"><Terminal className="mr-2 h-4 w-4"/> Conceptual Device Verification</h4>
                    <div className="flex gap-1">
                        <Button size="xs" variant={currentOs === 'windows' ? 'secondary' : 'ghost'} onClick={() => setCurrentOs('windows')} className="text-xs px-2 py-0.5 h-auto">Win</Button>
                        <Button size="xs" variant={currentOs === 'macos' ? 'secondary' : 'ghost'} onClick={() => setCurrentOs('macos')} className="text-xs px-2 py-0.5 h-auto">Mac</Button>
                        <Button size="xs" variant={currentOs === 'linux' ? 'secondary' : 'ghost'} onClick={() => setCurrentOs('linux')} className="text-xs px-2 py-0.5 h-auto">Lin</Button>
                    </div>
                  </div>
                  <pre className="bg-muted p-3 rounded-md text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    <code>{exampleCommands[currentOs]}</code>
                  </pre>
                  <p className="text-xs text-yellow-600/90 dark:text-yellow-400/80 mt-2">
                    <strong className="font-medium">Disclaimer:</strong> The command above is a conceptual example for device verification or accessing advanced features. It does not directly remove the embedded watermark. Watermark-free documents are typically a benefit of premium services.
                  </p>
                </div>
            </div>

            <div className="text-center pt-4">
                <Button asChild variant="outline">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" /> Go to Homepage
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <style jsx global>{`
        pre {
          font-family: var(--font-code), monospace; 
        }
      `}</style>
    </div>
  );
}
