
"use client";

import { FileQuestion } from "lucide-react";
// Removed Image import as we'll use iframe or a message

interface PdfViewerProps {
  fileUrl?: string; // This will now be a data URL for uploaded PDFs or a placeholder for mock URLs
}

export function PdfViewer({ fileUrl }: PdfViewerProps) {
  return (
    <div className="w-full h-full bg-muted border border-border rounded-lg flex flex-col items-center justify-center shadow-inner overflow-hidden">
      {fileUrl ? (
        (fileUrl.startsWith("data:application/pdf") || fileUrl.startsWith("blob:http")) ? ( // Check if it's a data URL or blob URL
          <iframe
            src={fileUrl}
            width="100%"
            height="100%"
            title="PDF Preview"
            className="border-0"
          />
        ) : (
          // Fallback for other URLs or if iframe is not suitable / for mock data
          <div className="p-8 text-center">
             <FileQuestion className="h-24 w-24 text-muted-foreground/50 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-muted-foreground">PDF Preview Unavailable</h3>
            <p className="text-sm text-muted-foreground">
              This document type cannot be previewed directly here, or it's a placeholder.
              <br/>URL: {fileUrl.substring(0,100) + (fileUrl.length > 100 ? "..." : "")}
            </p>
          </div>
        )
      ) : (
        <div className="p-8 text-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground/50 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-muted-foreground">No Document Loaded</h3>
          <p className="text-sm text-muted-foreground">Upload or select a document to view it here.</p>
        </div>
      )}
    </div>
  );
}

    