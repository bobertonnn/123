
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, CalendarDays, CheckCircle, Clock, Edit, Share2, Trash2, AlertCircle, UploadCloudIcon, MessageSquare } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Document {
  id: string;
  name: string;
  status: "Pending" | "Signed" | "Completed" | "Rejected" | "Uploaded";
  participants: string[];
  lastModified: string;
  thumbnailUrl?: string; 
  dataUrl?: string; 
  stampedSignatureUrl?: string | null;
  summary?: string;
}

interface DocumentCardProps {
  document: Document;
  onDeleteDocument?: (documentId: string) => void;
}

const statusStyles = {
  Pending: { icon: Clock, color: "bg-yellow-500", text: "text-yellow-700", border: "border-yellow-500" },
  Signed: { icon: CheckCircle, color: "bg-green-500", text: "text-green-700", border: "border-green-500" },
  Completed: { icon: CheckCircle, color: "bg-primary", text: "text-primary-foreground", border: "border-primary" },
  Rejected: { icon: AlertCircle, color: "bg-red-500", text: "text-red-700", border: "border-red-500" },
  Uploaded: { icon: UploadCloudIcon, color: "bg-blue-500", text: "text-blue-700", border: "border-blue-500" },
};

export function DocumentCard({ document, onDeleteDocument }: DocumentCardProps) {
  const currentStatusStyle = statusStyles[document.status] || statusStyles.Pending; 
  const StatusIcon = currentStatusStyle.icon;
  const statusTextColor = currentStatusStyle.text;
  const statusBorderColor = currentStatusStyle.border;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <FileText className="h-10 w-10 text-primary mb-2" />
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/documents/${document.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit/View Fields
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled> {/* Share functionality not implemented yet */}
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                {onDeleteDocument && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-900/30"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the document
                          "{document.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteDocument(document.id)}
                          className={buttonVariants({ variant: "destructive" })}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {document.thumbnailUrl ? (
            <Image 
              src={document.thumbnailUrl} 
              alt={`${document.name} thumbnail`} 
              width={300} 
              height={150} 
              className="rounded-md object-cover aspect-video mb-2"
            />
          ) : (
             <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
             </div>
          )}
          <CardTitle className="text-lg font-headline truncate" title={document.name}>{document.name}</CardTitle>
          <CardDescription className="flex items-center text-xs">
            <Badge variant="outline" className={`capitalize ${statusTextColor} ${statusBorderColor} bg-transparent`}>
              <StatusIcon className={`mr-1 h-3 w-3 ${statusTextColor}`} />
              {document.status}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
          {document.summary ? (
            <div className="flex items-start text-xs text-muted-foreground border-l-2 border-primary/50 pl-2 py-1 bg-primary/5 rounded-r-sm">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-primary/90 flex-shrink-0 mt-0.5" />
                <span className="italic">{document.summary}</span>
            </div>
          ) : (
             <div className="flex items-center text-xs text-muted-foreground/70">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                <span className="italic">No summary available.</span>
            </div>
          )}

          <div className="flex items-center pt-1">
            <Users className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{document.participants.join(", ")}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>Last modified: {document.lastModified}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/documents/${document.id}/edit`}>Open Document</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
