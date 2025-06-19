
"use client"; // Keep client directive if any client-side hooks are used (even for simplified version)

import React from 'react';

export default function SimplifiedPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("SimplifiedPublicLayout rendering now - testing layout structure.");
  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-green-500 text-white h-20 flex items-center justify-center"> {/* Made header very obvious */}
        <div className="container mx-auto flex h-full max-w-screen-2xl items-center justify-between">
          <p className="text-2xl font-bold">STATIC HEADER TEST</p>
          <p>Links Test</p>
        </div>
      </header>

      <main className="flex-1 bg-yellow-100"> {/* Added background to main for visibility */}
        {children}
      </main>

      <footer className="py-12 md:py-16 border-t border-border/40 bg-blue-500 text-white h-20 flex items-center justify-center"> {/* Made footer very obvious */}
        <div className="container mx-auto">
          <p className="text-center text-2xl font-bold">STATIC FOOTER TEST &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
