
"use client";

import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowRight, Linkedin, Twitter, Github, Youtube, Instagram, FacebookIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

// Definitions copied from src/app/page.tsx for footer links and social icons
const footerLinks = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Upload Document", href: "/documents/upload" },
    { label: "Templates", href: "/templates" },
    { label: "Public Signing Demo", href: "/sign/demo-link" },
  ],
  resources: [
    { label: "Help & Support", href: "/help" },
    { label: "FAQ", href: "/faq" }, // Assuming FAQ might be a section on help page or dedicated page
    { label: "Blog", href: "/blog" }, // Placeholder for blog
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ]
};

const socialIcons: Array<{ icon: LucideIcon; href: string; label: string }> = [
  { icon: FacebookIcon, href: "#facebook", label: "Facebook" },
  { icon: Twitter, href: "#twitter", label: "Twitter" },
  { icon: Instagram, href: "#instagram", label: "Instagram" },
  { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
  { icon: Youtube, href: "#youtube", label: "YouTube" },
  { icon: Github, href: "#github", label: "GitHub" },
];


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <span>Documentation</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="#"><span>Getting Started</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#"><span>API Reference</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help"><span>FAQs</span></Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <span>Tools</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard"><span>Dashboard</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/documents/upload"><span>Upload Document</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/templates"><span>Templates</span></Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild>
              <Link href="/auth/signin"><span>Sign In</span></Link>
            </Button>
            <Button asChild size="lg" className="btn-cta-primary-emerald">
              <Link href="/auth/signup">
                <span>
                  <span>Sign Up Free</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </Button>
          </nav>
        </div>
      </motion.header>

      <main className="flex-1"> {/* Removed flex items-center justify-center to allow pages to control their own layout */}
        {children}
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }} // Copied from page.tsx
        className="py-12 md:py-16 border-t border-border/40 bg-card text-card-foreground relative z-10"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="mb-4 inline-block">
                <Logo />
              </Link>
              <p className="text-sm text-muted-foreground">
                Simplifying document workflows with secure, intuitive digital signing.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-3 font-headline">Product</h5>
              <ul className="space-y-2 text-sm">
                {footerLinks.product.map(link => (
                  <li key={link.label}><Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors"><span>{link.label}</span></Link></li>
                ))}
              </ul>
            </div>

             <div>
              <h5 className="font-semibold mb-3 font-headline">Resources</h5>
              <ul className="space-y-2 text-sm">
                {footerLinks.resources.map(link => (
                  <li key={link.label}><Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors"><span>{link.label}</span></Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3 font-headline">Company</h5>
              <ul className="space-y-2 text-sm">
                {footerLinks.company.map(link => (
                  <li key={link.label}><Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors"><span>{link.label}</span></Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3 font-headline">Legal</h5>
              <ul className="space-y-2 text-sm">
                {footerLinks.legal.map(link => (
                  <li key={link.label}><Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors"><span>{link.label}</span></Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DocuSigner. All rights reserved.
            </p>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              {socialIcons.map(social => {
                const SocialIcon = social.icon;
                return (
                  <Link key={social.label} href={social.href} aria-label={social.label} className="text-muted-foreground hover:text-primary transition-colors">
                    <SocialIcon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
