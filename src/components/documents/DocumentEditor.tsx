
"use client";

import { PdfViewer } from "./PdfViewer";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, CheckCircle, Download, Loader2, Edit3, User, CalendarDays as CalendarDaysIcon, PenTool, FileText as FileTextIcon, ArrowRight, Users, Info, Type as TypeIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PublicLinkGenerator } from "@/components/shared/PublicLinkGenerator";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignatureCanvas } from "@/components/auth/SignatureCanvas";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts, PDFFont, degrees } from 'pdf-lib';

interface DocumentEditorProps {
  documentId: string;
  documentName?: string;
  documentDataUrl?: string | null;
}

type SigningRole = 'sender' | 'recipient';

const generateSignatureId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 26; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const formatTimestamp = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    try {
        return format(date, "yyyy-MM-dd hh:mm:ss a '(UTC)'");
    } catch (e) {
        console.error("Error formatting date:", date, e);
        return "Invalid Date";
    }
};

const getDeviceDescription = (): string => {
  if (typeof window === 'undefined') return "Unknown Device";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet Browser";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile Browser";
  }
  return "Desktop Browser";
};


export function DocumentEditor({
  documentId,
  documentName = "Untitled Document",
  documentDataUrl,
}: DocumentEditorProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [appendedFullName, setAppendedFullName] = useState<string | null>(null);
  const [appendedSignatureUrl, setAppendedSignatureUrl] = useState<string | null>(null);
  const [appendedDate, setAppendedDate] = useState<Date | null>(null);
  const [appendedRole, setAppendedRole] = useState<SigningRole | null>(null);

  const [isSigningSheetOpen, setIsSigningSheetOpen] = useState(false);
  const [signingSheetStep, setSigningSheetStep] = useState(0); 
  
  const [tempSigningRole, setTempSigningRole] = useState<SigningRole | null>(null);
  const [tempFullName, setTempFullName] = useState("");
  const [tempSignatureDataUrl, setTempSignatureDataUrl] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<Date | undefined>(new Date());

  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  useEffect(() => {
    if (isSigningSheetOpen) {
      setTempSigningRole(appendedRole); 
      setTempFullName(appendedFullName || "");
      setTempSignatureDataUrl(null); // Reset signature canvas on open
      setTempDate(appendedDate || new Date());
      setSigningSheetStep(0); 
    }
  }, [isSigningSheetOpen, appendedFullName, appendedDate, appendedRole]);


  const handleSheetNextStep = () => {
    if (signingSheetStep === 0 && !tempSigningRole) {
      toast({ variant: "destructive", title: "Role Required", description: "Please select a signing role."});
      return;
    }
    if (signingSheetStep === 1 && tempFullName.trim() === "") {
      toast({ variant: "destructive", title: "Full Name Required", description: "Please enter your full name."});
      return;
    }
    if (signingSheetStep === 2 && !tempSignatureDataUrl) {
      toast({ variant: "destructive", title: "Signature Required", description: "Please provide your signature."});
      return;
    }
     if (signingSheetStep === 3 && !tempDate) {
      toast({ variant: "destructive", title: "Date Required", description: "Please select a date."});
      return;
    }
    setSigningSheetStep(prev => prev + 1);
  };

  const handleSheetPreviousStep = () => {
    setSigningSheetStep(prev => prev - 1);
  };

  const handleApplySignatureDetailsFromSheet = () => {
    if (!tempSigningRole || tempFullName.trim() === "" || !tempSignatureDataUrl || !tempDate) {
         toast({ variant: "destructive", title: "Missing Information", description: "Please complete all steps to apply details."});
        return;
    }
    setAppendedRole(tempSigningRole);
    setAppendedFullName(tempFullName);
    setAppendedSignatureUrl(tempSignatureDataUrl); 
    setAppendedDate(tempDate);
    setIsSigningSheetOpen(false);
    toast({ title: "Details Applied", description: "Signature details are ready to be finalized onto the document."});
  };
  
  const handleFinalizeAndPrepareForSignedPage = async () => {
    if (!documentDataUrl) {
      toast({
        variant: "destructive",
        title: "No Document Loaded",
        description: "Please ensure a document is loaded before finalizing.",
      });
      return;
    }
    if (!appendedFullName || !appendedSignatureUrl || !appendedDate || !appendedRole) {
      toast({
        variant: "destructive",
        title: "Signature Details Missing",
        description: "Please add your signature details using the 'Add My Signature Details' process.",
      });
      return;
    }
  
    setIsProcessingPdf(true);
    toast({ title: "Processing PDF...", description: "Please wait while the document is being finalized." });
  
    try {
      let existingPdfBytes: ArrayBuffer;
      if (documentDataUrl.startsWith('data:application/pdf;base64,')) {
        const base64String = documentDataUrl.substring(documentDataUrl.indexOf(',') + 1);
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytesOutput = new Uint8Array(len); 
        for (let i = 0; i < len; i++) {
          bytesOutput[i] = binaryString.charCodeAt(i);
        }
        existingPdfBytes = bytesOutput.buffer;
      } else {
        toast({ variant: "destructive", title: "Format Error", description: "Document is not in expected data URI format."});
        setIsProcessingPdf(false);
        return;
      }

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const watermarkText = "DOCUSIGNER PREVIEW";
      const watermarkOpacity = 0.3; 
      const watermarkColor = rgb(0.5, 0.5, 0.5); // Gray color
      const rotationAngle = -45;

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();

        if (!(width > 0 && height > 0)) {
            console.warn(`Skipping watermark on page ${pages.indexOf(page) + 1} due to invalid/zero page dimensions: width=${width}, height=${height}`);
            continue; 
        }
        
        const pageDiagonal = Math.sqrt(width * width + height * height);
        // Adjust font size to be large and cover the document
        let fontSize = pageDiagonal / watermarkText.length; 
        fontSize = Math.max(24, Math.min(fontSize, 150)); // Clamp font size (min 24pt, max 150pt)
        
        // Simplified positioning for diagonal watermark
        // Start near top-left, let rotation and length span the page
        const x = width * 0.05; // 5% from the left
        const y = height * 0.75; // 75% from the bottom (25% from the top)


        page.drawText(watermarkText, {
          x: x,
          y: y,
          font: helveticaBoldFont,
          size: fontSize,
          color: watermarkColor,
          opacity: watermarkOpacity,
          rotate: degrees(rotationAngle),
        });
      }


      const lastPage = pages[pages.length - 1]; 
      const { width: pageWidth, height: pageHeight } = lastPage.getSize();
  
      const generalMargin = 50; 
      const boxHeight = 100;    
      const boxWidth = (pageWidth - (generalMargin * 3)) / 2; 
      const boxBottomY = 50;    
      const labelOffsetY = 5;   
      const textLineHeight = 12; 
      const contentPadding = 10; 

      const senderBoxX = generalMargin;
      const recipientBoxX = generalMargin + boxWidth + generalMargin;
      
      lastPage.drawRectangle({
        x: senderBoxX, y: boxBottomY, width: boxWidth, height: boxHeight,
        borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 1,
      });
      lastPage.drawText("Sender's Signature", {
        x: senderBoxX, y: boxBottomY + boxHeight + labelOffsetY, font: helveticaFont, size: 10, color: rgb(0.3, 0.3, 0.3),
      });

      lastPage.drawRectangle({
        x: recipientBoxX, y: boxBottomY, width: boxWidth, height: boxHeight,
        borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 1,
      });
      lastPage.drawText("Recipient's Signature", {
        x: recipientBoxX, y: boxBottomY + boxHeight + labelOffsetY, font: helveticaFont, size: 10, color: rgb(0.3, 0.3, 0.3),
      });
      
      const targetBoxX = appendedRole === 'recipient' ? recipientBoxX : senderBoxX;
      const targetBoxY = boxBottomY; 
      
      let currentContentY = targetBoxY + boxHeight - contentPadding - textLineHeight; 

      if (appendedDate) {
        lastPage.drawText(`Date: ${format(appendedDate, 'yyyy-MM-dd')}`, {
          x: targetBoxX + contentPadding, y: currentContentY, font: helveticaFont, size: 10, color: rgb(0, 0, 0), maxWidth: boxWidth - (2 * contentPadding),
        });
        currentContentY -= (textLineHeight + 5); 
      }
  
      if (appendedFullName) {
        lastPage.drawText(`Signed by: ${appendedFullName}`, {
          x: targetBoxX + contentPadding, y: currentContentY, font: helveticaFont, size: 10, color: rgb(0, 0, 0), maxWidth: boxWidth - (2 * contentPadding),
        });
        currentContentY -= (textLineHeight + 5); 
      }
  
      if (appendedSignatureUrl) { 
        const signatureImageBytes = await fetch(appendedSignatureUrl).then(res => res.arrayBuffer());
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes); 
        const remainingHeightForSig = currentContentY - (targetBoxY + contentPadding);
        const maxSigHeight = Math.max(remainingHeightForSig, 20); 
        const sigScaleByWidth = (boxWidth - 2 * contentPadding) / signatureImage.width;
        const sigScaleByHeight = maxSigHeight / signatureImage.height;
        const sigScale = Math.min(sigScaleByWidth, sigScaleByHeight, 0.35); 
        const signatureDims = signatureImage.scale(sigScale);
        const sigX = targetBoxX + (boxWidth - signatureDims.width) / 2; 
        const sigY = targetBoxY + contentPadding + Math.max(0, (remainingHeightForSig - signatureDims.height) / 2);
        lastPage.drawImage(signatureImage, {
          x: sigX, y: sigY, width: signatureDims.width, height: signatureDims.height,
        });
      }

      try {
        const certificatePage = pdfDoc.addPage();
        const { width: certPageWidth, height: certPageHeight } = certificatePage.getSize();
        const certMargin = 50;
        let currentCertY = certPageHeight - certMargin;
        const certLineHeight = 14;
        const smallLineHeight = 10;
        const sectionSpacing = 18; 
        const fieldSpacing = 8; 

        certificatePage.drawText("Signing Certificate", {
          x: certMargin, y: currentCertY, font: helveticaBoldFont, size: 18, color: rgb(0,0,0),
        });
        currentCertY -= (certLineHeight + sectionSpacing);

        certificatePage.drawText("Signer Information", {
            x: certMargin, y: currentCertY, font: helveticaBoldFont, size: 12, color: rgb(0.1, 0.1, 0.1)
        });
        currentCertY -= (certLineHeight + fieldSpacing);

        const userFullName = appendedFullName || "N/A";
        const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") ?? "email@example.com" : "email@example.com";

        certificatePage.drawText(`Signer: ${userFullName} (${userEmail})`, {
            x: certMargin, y: currentCertY, font: helveticaFont, size: 10, color: rgb(0.2, 0.2, 0.2)
        });
        currentCertY -= certLineHeight;
        certificatePage.drawText(`Authentication Level: Email`, {
            x: certMargin, y: currentCertY, font: helveticaFont, size: 10, color: rgb(0.2, 0.2, 0.2)
        });
        currentCertY -= (certLineHeight + sectionSpacing);

        certificatePage.drawText("Signature", {
            x: certMargin, y: currentCertY, font: helveticaBoldFont, size: 12, color: rgb(0.1, 0.1, 0.1)
        });
        currentCertY -= (certLineHeight + fieldSpacing);
        
        const sigBoxHeight = 60; 
        const sigBoxWidth = certPageWidth / 2 - certMargin - 10; 
        const sigBoxX = certMargin;
        const sigBoxY = currentCertY - sigBoxHeight - 5;

        if (appendedSignatureUrl) { 
          try {
            const signatureImageBytesInner = await fetch(appendedSignatureUrl).then(res => { 
              if (!res.ok) throw new Error(`Failed to fetch signature image for certificate: ${res.status} ${res.statusText}`);
              return res.arrayBuffer();
            });
            const signatureImageInner = await pdfDoc.embedPng(signatureImageBytesInner); 
            
            const paddingInBox = 0; 
            const maxSigImgHeight = sigBoxHeight - 2 * paddingInBox;
            const maxSigImgWidth = sigBoxWidth - 2 * paddingInBox;

            let sigDisplayWidth = signatureImageInner.width;
            let sigDisplayHeight = signatureImageInner.height;

            if (sigDisplayWidth > maxSigImgWidth) {
                const scale = maxSigImgWidth / sigDisplayWidth;
                sigDisplayWidth *= scale;
                sigDisplayHeight *= scale;
            }
            if (sigDisplayHeight > maxSigImgHeight) {
                const scale = maxSigImgHeight / sigDisplayHeight;
                sigDisplayHeight *= scale;
                sigDisplayWidth *= scale;
            }
            
            certificatePage.drawImage(signatureImageInner, {
              x: sigBoxX + (sigBoxWidth - sigDisplayWidth) / 2, 
              y: sigBoxY + (sigBoxHeight - sigDisplayHeight) / 2, 
              width: sigDisplayWidth,
              height: sigDisplayHeight,
            });
          } catch (sigImgError) {
            console.error("Error embedding signature on certificate page:", sigImgError);
            const errMsg = sigImgError instanceof Error ? sigImgError.message : "Signature image load error";
            certificatePage.drawText(`Signature Error: ${errMsg.substring(0,50)}`, {
              x: sigBoxX + 5, y: sigBoxY + sigBoxHeight / 2, font: helveticaFont, size: 8, color: rgb(1,0,0), maxWidth: sigBoxWidth - 10
            });
          }
        } else {
          certificatePage.drawText("No signature provided.", {
            x: sigBoxX + 5, y: sigBoxY + sigBoxHeight / 2, font: helveticaFont, size: 9, color: rgb(0.5,0.5,0.5), maxWidth: sigBoxWidth - 10
          });
        }
        
        let detailsX = sigBoxX + sigBoxWidth + 20;
        let detailsY = currentCertY - 5; 

        const signatureId = generateSignatureId();
        certificatePage.drawText(`Signature ID: ${signatureId}`, {
            x: detailsX, y: detailsY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2)
        });
        detailsY -= (smallLineHeight + 2);
        certificatePage.drawText(`IP Address: N/A (Client-side)`, { 
            x: detailsX, y: detailsY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2)
        });
        detailsY -= (smallLineHeight + 2);
        certificatePage.drawText(`Device: ${getDeviceDescription()}`, {
            x: detailsX, y: detailsY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2)
        });
        currentCertY = sigBoxY - sectionSpacing; 

        certificatePage.drawText("Details", {
            x: certMargin, y: currentCertY, font: helveticaBoldFont, size: 12, color: rgb(0.1,0.1,0.1)
        });
        currentCertY -= (certLineHeight + fieldSpacing);

        const nowForAudit = new Date(); 
        const signedTimestamp = appendedDate ? formatTimestamp(appendedDate) : formatTimestamp(nowForAudit);
                
        const baseTimeForSim = appendedDate ? appendedDate.getTime() : nowForAudit.getTime();
        const viewedTime = new Date(baseTimeForSim - Math.floor(Math.random() * 5 * 60 * 1000) - 60000); 
        const sentTime = new Date(viewedTime.getTime() - Math.floor(Math.random() * 10 * 60 * 1000) - 60000); 

        const sentFormattedTimestamp = formatTimestamp(sentTime);
        const viewedFormattedTimestamp = formatTimestamp(viewedTime);
        
        certificatePage.drawText(`Sent: ${sentFormattedTimestamp}`, { x: certMargin, y: currentCertY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2) });
        currentCertY -= smallLineHeight;
        certificatePage.drawText(`Viewed: ${viewedFormattedTimestamp}`, { x: certMargin, y: currentCertY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2) });
        currentCertY -= smallLineHeight;
        certificatePage.drawText(`Signed: ${signedTimestamp}`, { x: certMargin, y: currentCertY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2) });
        currentCertY -= smallLineHeight;
        certificatePage.drawText(`Reason: I am the owner of this document`, { x: certMargin, y: currentCertY, font: helveticaFont, size: 9, color: rgb(0.2,0.2,0.2) });
        currentCertY -= (smallLineHeight + sectionSpacing);

        certificatePage.drawText(`Signing certificate provided by: DocuSigner`, {
            x: certMargin, y: certMargin / 2, font: helveticaFont, size: 8, color: rgb(0.5,0.5,0.5)
        });

      } catch (certPageError) {
        console.error("ERROR DRAWING CERTIFICATE PAGE:", certPageError);
        toast({
          variant: "destructive",
          title: "Certificate Page Error",
          description: "Could not generate the certificate page. The document will be finalized without it. Details: " + (certPageError instanceof Error ? certPageError.message : String(certPageError)),
          duration: 10000, 
        });
        try {
            const errorCertPage = pdfDoc.addPage(); 
            errorCertPage.drawText("Error: Certificate page could not be generated. Please check console.", {
                x:50, y: errorCertPage.getSize().height - 50, font: helveticaFont, size:12, color: rgb(1,0,0)
            });
        } catch (e) {
            console.error("Failed to add error message page for certificate failure", e);
        }
      }
  
      const finalizedPdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      
      localStorage.setItem('finalizedDocumentData', JSON.stringify({
        finalizedPdfDataUri: finalizedPdfDataUri,
        signatureUrl: appendedSignatureUrl, 
        documentName: documentName
      }));

      router.push(`/documents/${documentId}/signed`);
  
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Processing Error",
        description: String(error instanceof Error ? error.message : "An unknown error occurred."),
      });
    } finally {
      setIsProcessingPdf(false);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] bg-background rounded-xl shadow-2xl overflow-hidden">
      <header className="flex items-center justify-between p-3 border-b bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-lg font-semibold font-headline truncate" title={documentName}>{documentName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <PublicLinkGenerator documentId={documentId} triggerButton={
            <Button className="btn-gradient-hover" size="sm">
              <Send className="mr-1 h-4 w-4" />
              <span>Share for Signing</span>
            </Button>
          } />
        </div>
      </header>

      <div className="p-3 border-b bg-card shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsSigningSheetOpen(true)}>
            <Edit3 className="mr-1.5 h-4 w-4" /> Add My Signature Details
          </Button>
           <Button 
            onClick={handleFinalizeAndPrepareForSignedPage} 
            disabled={isProcessingPdf || !documentDataUrl || (!appendedFullName || !appendedSignatureUrl || !appendedDate || !appendedRole)}
            className="btn-gradient-hover ml-auto" 
            size="sm"
          >
            {isProcessingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileTextIcon className="mr-2 h-4 w-4" />}
            Finalize Document
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-row overflow-hidden"> 
        <motion.div
          className="flex-grow bg-muted/50 p-4 overflow-y-auto relative" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PdfViewer fileUrl={documentDataUrl} />
        </motion.div>

        {(appendedFullName || appendedSignatureUrl || appendedDate || appendedRole) && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }} 
            animate={{ opacity: 1, width: '24rem' }}
            transition={{ duration: 0.3 }}
            className="w-96 p-4 border-l bg-card shrink-0 overflow-y-auto" 
          >
            <h3 className="text-md font-semibold mb-3 font-headline flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary"/> Appended Information:
            </h3>
            <div className="space-y-3 text-sm">
              {appendedRole && (
                 <div className="p-3 border rounded-md bg-muted/50">
                  <Label className="font-medium text-muted-foreground flex items-center"><Users className="mr-2 h-4 w-4"/>Signing as:</Label>
                  <p className="text-foreground mt-1 capitalize pl-6">{appendedRole}</p>
                </div>
              )}
              {appendedSignatureUrl && ( 
                <div className="p-3 border rounded-md bg-muted/50">
                  <Label className="font-medium text-muted-foreground flex items-center"><PenTool className="mr-2 h-4 w-4"/>Signature:</Label>
                  <div className="mt-1 inline-block bg-card p-1 border rounded-sm shadow-sm ml-6">
                    <Image src={appendedSignatureUrl} alt="Appended signature" width={200} height={75} data-ai-hint="signature image"/>
                  </div>
                </div>
              )}
              {appendedFullName && (
                <div className="p-3 border rounded-md bg-muted/50">
                  <Label className="font-medium text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4"/>Full Name:</Label>
                  <p className="text-foreground mt-1 pl-6">{appendedFullName}</p>
                </div>
              )}
              {appendedDate && (
                <div className="p-3 border rounded-md bg-muted/50">
                  <Label className="font-medium text-muted-foreground flex items-center"><CalendarDaysIcon className="mr-2 h-4 w-4"/>Date:</Label>
                  <p className="text-foreground mt-1 pl-6">{format(appendedDate, 'PPP')}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <Sheet open={isSigningSheetOpen} onOpenChange={setIsSigningSheetOpen}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-2xl font-headline flex items-center">
                {signingSheetStep === 0 && <Users className="mr-3 h-6 w-6 text-primary" />}
                {signingSheetStep === 1 && <TypeIcon className="mr-3 h-6 w-6 text-primary" />}
                {signingSheetStep === 2 && <PenTool className="mr-3 h-6 w-6 text-primary" />}
                {signingSheetStep === 3 && <CalendarDaysIcon className="mr-3 h-6 w-6 text-primary" />}
                {signingSheetStep === 0 && "Select Your Role"}
                {signingSheetStep === 1 && "Enter Your Full Name"}
                {signingSheetStep === 2 && "Provide Your Signature"}
                {signingSheetStep === 3 && "Select Signing Date"}
            </SheetTitle>
            <SheetDescription>
                Step {signingSheetStep + 1} of 4. Complete the details to be added to the document.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto" key={`signing-step-${signingSheetStep}`}>
            {signingSheetStep === 0 && (
              <RadioGroup value={tempSigningRole ?? ""} onValueChange={(value) => setTempSigningRole(value as SigningRole)}>
                <Label htmlFor="role-sender" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <RadioGroupItem value="sender" id="role-sender" />
                  <div className="flex flex-col">
                    <span>Sign as Sender</span>
                    <span className="text-xs text-muted-foreground">Details will be placed in the sender's box.</span>
                  </div>
                </Label>
                <Label htmlFor="role-recipient" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <RadioGroupItem value="recipient" id="role-recipient" />
                   <div className="flex flex-col">
                    <span>Sign as Recipient</span>
                    <span className="text-xs text-muted-foreground">Details will be placed in the recipient's box.</span>
                  </div>
                </Label>
              </RadioGroup>
            )}
            {signingSheetStep === 1 && (
              <div>
                <Label htmlFor="sheetFullNameInput">Full Name</Label>
                <Input 
                    id="sheetFullNameInput" 
                    value={tempFullName} 
                    onChange={(e) => setTempFullName(e.target.value)} 
                    placeholder="Enter your full legal name"
                    className="mt-1"
                    autoFocus
                />
              </div>
            )}
            {signingSheetStep === 2 && (
               <div className="flex flex-col items-center">
                 <Label className="self-start mb-2">Your Signature</Label>
                <SignatureCanvas 
                    onSave={(dataUrl) => {
                        setTempSignatureDataUrl(dataUrl);
                        toast({ title: "Signature Captured!", description: "Click Next to continue."});
                    }} 
                    width={320} height={160} 
                    backgroundColor="transparent" 
                    penColor="hsl(var(--foreground))"
                />
                {tempSignatureDataUrl && <CheckCircle className="text-green-500 mt-2 h-5 w-5" title="Signature captured"/>}
              </div>
            )}
            {signingSheetStep === 3 && (
              <div className="flex flex-col items-center">
                 <Label className="self-start mb-2">Date of Signing</Label>
                <Calendar
                  mode="single"
                  selected={tempDate}
                  onSelect={setTempDate}
                  initialFocus
                  className="border rounded-md"
                />
              </div>
            )}
          </div>

          <SheetFooter className="p-6 border-t mt-auto">
            <div className="flex w-full justify-between items-center">
              <Button variant="outline" onClick={handleSheetPreviousStep} disabled={signingSheetStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              {signingSheetStep < 3 ? (
                <Button onClick={handleSheetNextStep} className="btn-gradient-hover">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleApplySignatureDetailsFromSheet} className="btn-gradient-hover">
                  <CheckCircle className="mr-2 h-4 w-4" /> Apply Details
                </Button>
              )}
            </div>
            <SheetClose asChild className="mt-4 w-full">
                <Button variant="ghost" className="text-muted-foreground">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

    