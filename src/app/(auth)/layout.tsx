
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="absolute top-8 left-8">
        {/* Using simple text for logo to avoid any component issues */}
        <Link href="/">
          <span className="text-2xl font-semibold text-foreground">DocuSigner (Auth Layout Test)</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
