
"use client";

import { DocumentCard, type Document } from '@/components/documents/DocumentCard';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('uploadedDocuments');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredDocuments = (documents: Document[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('uploadedDocuments', JSON.stringify(documents));
  window.dispatchEvent(new CustomEvent('storageChanged', { detail: { key: 'uploadedDocuments' } }));
};

export default function AllDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = () => {
    setIsLoading(true);
    const loadedDocs = getStoredDocuments();
    setDocuments(loadedDocs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
    
    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.key === 'uploadedDocuments') {
            fetchDocuments();
        } else if ((event as StorageEvent).key === 'uploadedDocuments') { // Fallback for direct localStorage changes
            fetchDocuments();
        }
    };

    window.addEventListener('storageChanged', handleStorageChange);
    window.addEventListener('storage', handleStorageChange); // Listen to direct storage events too

    return () => {
        window.removeEventListener('storageChanged', handleStorageChange);
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    saveStoredDocuments(updatedDocuments);
    setDocuments(updatedDocuments);
    toast({
      title: "Document Deleted",
      description: "The document has been successfully removed.",
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">All Documents</h1>
        <Button asChild className="btn-gradient-hover">
          <Link href="/documents/upload">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Upload New Document</span>
          </Link>
        </Button>
      </div>

      <DocumentFilters /> {/* Filters are present but not yet fully wired to state */}

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDeleteDocument={handleDeleteDocument} />
          ))}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10 bg-card rounded-lg shadow"
        >
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Documents Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your first document to get started.
          </p>
          <Button className="mt-6 btn-gradient-hover" asChild>
             <Link href="/documents/upload">
                <PlusCircle className="mr-2 h-4 w-4" /> <span>Upload Document</span>
             </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
