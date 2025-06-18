"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Link2, Check, Settings, CalendarDays } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface PublicLinkGeneratorProps {
  documentId: string;
  triggerButton?: React.ReactNode; // Allow custom trigger
}

export function PublicLinkGenerator({ documentId, triggerButton }: PublicLinkGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [requireEmail, setRequireEmail] = useState(true);
  const [expires, setExpires] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");


  const handleGenerateLink = () => {
    // Simulate link generation
    const newLink = `${window.location.origin}/public/sign/${documentId}?token=${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedLink(newLink);
    setLinkCopied(false); // Reset copied status
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button variant="outline"><Link2 className="mr-2 h-4 w-4" /> Get Public Link</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center">
            <Link2 className="mr-2 h-6 w-6 text-primary" /> Generate Public Signing Link
          </DialogTitle>
          <DialogDescription>
            Share this link with anyone to collect their signature on the document.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {!generatedLink ? (
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="requireEmail" className="flex flex-col space-y-1">
                        <span>Require Email Verification</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                        Signers will need to verify their email before signing.
                        </span>
                    </Label>
                    <Switch
                        id="requireEmail"
                        checked={requireEmail}
                        onCheckedChange={setRequireEmail}
                    />
                </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="expires" className="flex flex-col space-y-1">
                        <span>Set Expiration Date</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                        The link will automatically expire after this date.
                        </span>
                    </Label>
                    <Switch
                        id="expires"
                        checked={expires}
                        onCheckedChange={setExpires}
                    />
                </div>
                {expires && (
                    <div className="pl-3">
                        <Label htmlFor="expiryDate">Expiration Date</Label>
                        <Input 
                            type="date" 
                            id="expiryDate" 
                            value={expiryDate} 
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                )}
             </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="publicLink">Your public signing link:</Label>
              <div className="flex space-x-2">
                <Input id="publicLink" value={generatedLink} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyLink} title="Copy link">
                  {linkCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {linkCopied && <p className="text-xs text-green-600 text-center">Link copied to clipboard!</p>}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          {generatedLink && (
            <Button variant="link" onClick={() => setGeneratedLink("")} className="text-muted-foreground">
                <Settings className="mr-2 h-4 w-4"/> Adjust Settings
            </Button>
          )}
          <Button 
            type="button" 
            onClick={handleGenerateLink} 
            className={`btn-gradient-hover ${generatedLink ? 'w-auto' : 'w-full'}`}
            disabled={!generatedLink && expires && !expiryDate}
            >
            {generatedLink ? "Re-generate Link (new settings)" : "Generate Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
