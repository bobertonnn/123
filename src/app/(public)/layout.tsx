
"use client";

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("PublicLayout (for /about, /contact etc.) rendering.");
  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
