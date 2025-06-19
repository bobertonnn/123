
"use client"; 

import { DocumentCard, type Document } from '@/components/documents/DocumentCard';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, FileText, Settings, UploadCloud, FileSignature, Info, CheckCircle, Loader2 } from 'lucide-react'; 
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Progress } from "@/components/ui/progress"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { useToast } from "@/hooks/use-toast"; 
import { ProductTour, type TourStep } from '@/components/shared/ProductTour';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


// TODO: [DB Integration] Replace with checks against database data (e.g., user profile completion, document count).
const initialOnboardingSteps = [
  { id: 'profile', label: 'Complete Your Profile', check: () => typeof window !== 'undefined' && !!(localStorage.getItem('userFullName') && localStorage.getItem('userSignature')), icon: Settings, href: '/profile' },
  { id: 'upload', label: 'Upload Your First Document', check: () => typeof window !== 'undefined' && (JSON.parse(localStorage.getItem('uploadedDocuments') || '[]') as Document[]).length > 0, icon: UploadCloud, href: '/documents/upload' },
];

const tourSteps: TourStep[] = [
  { title: "Welcome to DocuSigner!", description: "Let's quickly go over the main features.", targetId: null },
  { title: "Dashboard Overview", description: "This is your main dashboard where you'll see all your documents.", targetId: "dashboard-title"  },
  { title: "Uploading Documents", description: "Click here to upload a new PDF document to sign or send.", targetId: "upload-button"  },
  { title: "Document Cards", description: "Each card represents a document. You can see its status and quick actions.", targetId: "document-card-example"  },
  { title: "Filtering", description: "Use these filters to find specific documents quickly.", targetId: "document-filters"  },
  { title: "Navigation Sidebar", description: "Use the sidebar (on larger screens) to navigate to different sections like Templates or Settings.", targetId: null  },
  { title: "You're All Set!", description: "Explore and enjoy streamlining your document workflows!", targetId: null },
];

// TODO: [DB Integration] Replace localStorage with API calls to fetch documents.
const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('uploadedDocuments');
  return stored ? JSON.parse(stored) : [];
};

// TODO: [DB Integration] This function would be replaced by API calls to delete documents.
const saveStoredDocuments = (documents: Document[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('uploadedDocuments', JSON.stringify(documents));
  window.dispatchEvent(new CustomEvent('storageChanged', { detail: { key: 'uploadedDocuments' } }));
};


export default function DashboardPage() {
  const [setupProgress, setSetupProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);
  const { toast } = useToast();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedParticipant, setSelectedParticipant] = useState<string | undefined>(undefined);
  const [displayedDocuments, setDisplayedDocuments] = useState<Document[]>([]);
  const [allLoadedDocuments, setAllLoadedDocuments] = useState<Document[]>([]);


  const [clientOnboardingSteps, setClientOnboardingSteps] = useState(
    initialOnboardingSteps.map(step => ({ ...step, isDoneClient: false }))
  );

  useEffect(() => {
    setIsLoadingDocuments(true);
    if (typeof window !== 'undefined') {
        // TODO: [DB Integration] Fetch documents from the backend here.
        // Example:
        // const fetchDocs = async () => {
        //   const response = await fetch('/api/documents?userId=...'); // Get user ID from auth
        //   const docs = await response.json();
        //   setAllLoadedDocuments(docs);
        //   // Update onboarding checks based on fetched data
        // };
        // fetchDocs();
        const loadedDocs = getStoredDocuments();
        setAllLoadedDocuments(loadedDocs);

        const onboardingDismissed = localStorage.getItem('onboardingPromptDismissed');
        if (!onboardingDismissed) {
            // TODO: [DB Integration] Profile check should also use data from backend.
            const profileName = localStorage.getItem('userFullName');
            if (loadedDocs.length === 0 && !profileName) {
            setShowOnboardingPrompt(true);
            }
        }

        let doneSteps = 0;
        const updatedClientSteps = initialOnboardingSteps.map(step => {
            const isStepDone = step.check(); // This check needs to be DB-aware in future
            if (isStepDone) {
                doneSteps++;
            }
            return { ...step, isDoneClient: isStepDone };
        });
        
        setClientOnboardingSteps(updatedClientSteps);
        setCompletedSteps(doneSteps);
        setSetupProgress(Math.round((doneSteps / initialOnboardingSteps.length) * 100));
    }
    setIsLoadingDocuments(false);
  }, []);

  useEffect(() => {
    let filtered = allLoadedDocuments;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(lowerSearchTerm) ||
        (doc.summary && doc.summary.toLowerCase().includes(lowerSearchTerm)) ||
        doc.participants.some(p => p.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(doc => doc.lastModified === dateString);
    }
    
    if (selectedParticipant) {
       filtered = filtered.filter(doc => doc.participants.includes(selectedParticipant));
    }

    setDisplayedDocuments(filtered);
  }, [searchTerm, selectedStatus, selectedDate, selectedParticipant, allLoadedDocuments]);


  const dismissOnboardingPrompt = () => {
    setShowOnboardingPrompt(false);
    if (typeof window !== 'undefined') {
        // TODO: [DB Integration] Save this preference to the user's profile in the database.
        localStorage.setItem('onboardingPromptDismissed', 'true');
    }
  };

  const startTour = () => {
    dismissOnboardingPrompt();
    setIsTourOpen(true);
    setCurrentTourStep(0);
  };
  
  const handleTourNext = () => {
    setCurrentTourStep(prev => Math.min(prev + 1, tourSteps.length - 1));
  };

  const handleTourPrev = () => {
    setCurrentTourStep(prev => Math.max(prev - 1, 0));
  };

  const handleTourFinish = () => {
    setIsTourOpen(false);
  };

  // TODO: [DB Integration] Replace with an API call to delete the document from the database.
  const handleDeleteDocument = (documentId: string) => {
    // Example:
    // await fetch(`/api/documents/${documentId}`, { method: 'DELETE' });
    // setAllLoadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    const updatedDocuments = allLoadedDocuments.filter(doc => doc.id !== documentId);
    saveStoredDocuments(updatedDocuments); // For localStorage prototype
    setAllLoadedDocuments(updatedDocuments);
    toast({
      title: "Document Deleted",
      description: "The document has been successfully removed.",
    });
  };

  const uniqueParticipants = useMemo(() => {
    const participantsSet = new Set<string>();
    allLoadedDocuments.forEach(doc => {
      doc.participants.forEach(p => participantsSet.add(p));
    });
    return Array.from(participantsSet).sort();
  }, [allLoadedDocuments]);


  return (
    <div className="container mx-auto">
      <AnimatePresence>
        {showOnboardingPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 }}}
            className="mb-4"
          >
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Welcome to DocuSigner!</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span>New here? Take a quick tour to learn the basics.</span>
                <div className="mt-2 sm:mt-0 flex gap-2">
                   <Button onClick={startTour} size="sm">Start Tour</Button>
                   <Button onClick={dismissOnboardingPrompt} variant="ghost" size="sm">Dismiss</Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline" id="dashboard-title">Document Dashboard</h1>
        <Button asChild className="btn-gradient-hover" id="upload-button">
          <Link href="/documents/upload">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Upload New Document</span>
          </Link>
        </Button>
      </div>

      {completedSteps < clientOnboardingSteps.length && (
         <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mb-6"
        >
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Setup Progress</CardTitle>
            <CardDescription>Complete these steps to get the most out of DocuSigner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={setupProgress} className="w-full h-2 mb-3" />
            <p className="text-sm text-muted-foreground">{completedSteps} of {clientOnboardingSteps.length} steps completed.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clientOnboardingSteps.map(step => {
                const Icon = step.icon;
                const isDone = step.isDoneClient;
                return (
                  <Link href={step.href} key={step.id}>
                    <div className={`p-3 border rounded-md flex items-center space-x-2 transition-all ${isDone ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-muted/30 hover:bg-muted/60'}`}>
                      <Icon className={`w-5 h-5 ${isDone ? '' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">{step.label}</span>
                      {isDone && <CheckCircle className="w-4 h-4 ml-auto text-primary" />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      <div id="document-filters">
        <DocumentFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedParticipant={selectedParticipant}
          onParticipantChange={setSelectedParticipant}
          allParticipants={uniqueParticipants}
        />
      </div>
      
      {isLoadingDocuments ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading documents...</p>
        </div>
      ) : displayedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedDocuments.map((doc, index) => (
            <div key={doc.id} id={index === 0 ? "document-card-example" : undefined}>
              <DocumentCard document={doc} onDeleteDocument={handleDeleteDocument} />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10 bg-card rounded-lg shadow"
        >
          <FileText className="mx-auto h-16 w-16 text-primary/50 mb-3" />
          <h3 className="mt-2 text-2xl font-semibold font-headline">
            {allLoadedDocuments.length > 0 ? "No Documents Match Filters" : "No Documents Yet"}
          </h3>
          <p className="mt-1 text-md text-muted-foreground">
            {allLoadedDocuments.length > 0 
              ? "Try adjusting your search or filter criteria."
              : "It looks a bit empty here. Upload your first document to get started."
            }
          </p>
          {allLoadedDocuments.length === 0 && !searchTerm && !selectedStatus && !selectedDate && !selectedParticipant && (
             <Button className="mt-6 btn-gradient-hover px-6 py-3 text-base group" asChild>
                <Link href="/documents/upload">
                    <UploadCloud className="mr-2 h-5 w-5 transition-transform group-hover:animate-pulse" /> <span>Upload Your First Document</span>
                </Link>
             </Button>
          )}
        </motion.div>
      )}
      {isTourOpen && (
        <ProductTour
          steps={tourSteps}
          currentStepIndex={currentTourStep}
          onNext={handleTourNext}
          onPrev={handleTourPrev}
          onFinish={handleTourFinish}
        />
      )}
    </div>
  );
}
