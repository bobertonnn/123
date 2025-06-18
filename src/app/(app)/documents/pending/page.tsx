import { DocumentCard, type Document } from '@/components/documents/DocumentCard';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

const allMockDocuments: Document[] = [
  { id: '1', name: 'Q3 Sales Agreement Long Name That Might Overflow', status: 'Pending', participants: ['Alice', 'Bob'], lastModified: '2023-10-26', thumbnailUrl: 'https://placehold.co/300x150.png?text=Doc1' },
  { id: '2', name: 'NDA for Project Phoenix', status: 'Signed', participants: ['Charlie', 'Diana'], lastModified: '2023-10-25', thumbnailUrl: 'https://placehold.co/300x150.png?text=Doc2' },
  { id: '3', name: 'Employee Handbook v2.1', status: 'Completed', participants: ['HR Dept'], lastModified: '2023-10-20', thumbnailUrl: 'https://placehold.co/300x150.png?text=Doc3' },
  { id: '4', name: 'Service Level Agreement', status: 'Pending', participants: ['Eve', 'Frank'], lastModified: '2023-10-28' },
  { id: '5', name: 'Partnership Proposal', status: 'Rejected', participants: ['Grace', 'Heidi'], lastModified: '2023-10-15', thumbnailUrl: 'https://placehold.co/300x150.png?text=Doc5' },
  { id: '6', name: 'Website Terms of Service Update', status: 'Completed', participants: ['Legal Team'], lastModified: '2023-09-30' },
];

const pendingDocuments = allMockDocuments.filter(doc => doc.status === 'Pending');

export default function PendingDocumentsPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold font-headline">Pending My Signature</h1>
        </div>
        <Button asChild className="btn-gradient-hover">
          <Link href="/documents/upload">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Upload New Document</span>
          </Link>
        </Button>
      </div>

      <DocumentFilters />

      {pendingDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pendingDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-card rounded-lg shadow">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Pending Documents</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You have no documents currently awaiting your signature.
          </p>
           <Button className="mt-6 btn-gradient-hover" asChild>
             <Link href="/documents/upload">
                <PlusCircle className="mr-2 h-4 w-4" /> <span>Upload Document</span>
             </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
