
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <Card className="shadow-xl rounded-2xl max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Terms of Service</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the DocuSigner website and services (the "Service") operated by DocuSigner ("us", "we", or "our").</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">1. Agreement to Terms</h2>
          <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">2. Accounts</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">3. Intellectual Property</h2>
          <p>The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of DocuSigner and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">4. User Content</h2>
          <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
          <p>By posting Content on or through the Service, You represent and warrant that: (i) the Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity.</p>
          
          <h2 className="font-headline text-xl font-semibold text-foreground">5. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">6. Limitation Of Liability</h2>
          <p>In no event shall DocuSigner, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          
          <h2 className="font-headline text-xl font-semibold text-foreground">7. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">8. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at: legal@docusigner.com (placeholder email).</p>
        </CardContent>
      </Card>
    </div>
  );
}
