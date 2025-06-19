
"use client";

import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';

export function PublicFooter() {
  console.log("PublicFooter rendering.");
  return (
    <footer className="py-12 md:py-16 border-t border-border/40 bg-background">
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Resources</h4>
            <ul className="space-y-2">
              {/* <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog (TBD)</Link></li> */}
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DocuSigner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
