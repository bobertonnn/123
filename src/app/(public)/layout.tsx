
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function StandardPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("StandardPublicLayout (for /about, /contact, etc.) rendering.");
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1 py-8 md:py-12 bg-background">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
