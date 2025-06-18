
"use client";

import { DocumentEditor } from '@/components/documents/DocumentEditor';
import type { Document } from '@/components/documents/DocumentCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function EditDocumentPage({ params }: { params: { id: string } }) {
  const documentId = params.id;
  const router = useRouter();

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setError("Document ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (typeof window !== 'undefined') {
      try {
        const storedDocumentsRaw = localStorage.getItem('uploadedDocuments');
        if (storedDocumentsRaw) {
          const storedDocuments: Document[] = JSON.parse(storedDocumentsRaw);
          const foundDocument = storedDocuments.find(doc => doc.id === documentId);
          if (foundDocument) {
            setDocument(foundDocument);
          } else {
            setError(`Document with ID ${documentId} not found.`);
          }
        } else {
          setError("No documents found in local storage.");
        }
      } catch (e) {
        console.error("Failed to load document from localStorage:", e);
        setError("Failed to load document data due to an error.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // This case should ideally not be hit if "use client" is respected,
      // but as a safeguard:
      setError("Cannot access document storage on the server.");
      setIsLoading(false);
    }
  }, [documentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading Document</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (!document) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Document Not Found</h2>
            <p className="text-muted-foreground">The requested document could not be loaded or does not exist.</p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Go to Dashboard
            </Button>
        </div>
    );
  }

  return (
    <div className="h-full -m-6">
      <DocumentEditor
        documentId={document.id}
        documentName={document.name}
        documentDataUrl={document.dataUrl}
      />
    </div>
  );
}
