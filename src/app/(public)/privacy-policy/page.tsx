
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <Card className="shadow-xl rounded-2xl max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Privacy Policy</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Welcome to DocuSigner's Privacy Policy. This policy describes how DocuSigner ("we," "us," or "our") collects, uses, and shares personal information when you use our website and services (collectively, the "Services").</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>We may collect personal information directly from you, such as when you create an account, upload documents, or contact us for support. This information may include:</p>
          <ul>
            <li>Contact Information: Name, email address, phone number.</li>
            <li>Account Information: Username, password, profile details.</li>
            <li>Document Information: Documents you upload, sign, or share, including content and metadata.</li>
            <li>Usage Information: How you interact with our Services, IP address, browser type, device information.</li>
            <li>Cookies and Tracking Technologies: Information collected through cookies and similar technologies.</li>
          </ul>

          <h2 className="font-headline text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your personal information for various purposes, including:</p>
          <ul>
            <li>To provide, maintain, and improve our Services.</li>
            <li>To process transactions and send related information, including confirmations and invoices.</li>
            <li>To send technical notices, updates, security alerts, and support messages.</li>
            <li>To respond to your comments, questions, and requests, and provide customer service.</li>
            <li>To communicate with you about products, services, offers, promotions, and events offered by DocuSigner and others.</li>
            <li>To monitor and analyze trends, usage, and activities in connection with our Services.</li>
            <li>To personalize and improve the Services and provide content or features that match user profiles or interests.</li>
          </ul>

          <h2 className="font-headline text-xl font-semibold text-foreground">3. How We Share Your Information</h2>
          <p>We may share your personal information as follows:</p>
          <ul>
            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
            <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of DocuSigner or others.</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
            <li>Between and among DocuSigner and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership.</li>
            <li>With your consent or at your direction.</li>
          </ul>

          <h2 className="font-headline text-xl font-semibold text-foreground">4. Your Choices</h2>
          <p>You have certain choices regarding your personal information:</p>
          <ul>
            <li>Account Information: You may update, correct, or delete your account information at any time by logging into your account or contacting us.</li>
            <li>Cookies: Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies.</li>
            <li>Promotional Communications: You may opt out of receiving promotional emails from us by following the instructions in those emails.</li>
          </ul>

          <h2 className="font-headline text-xl font-semibold text-foreground">5. Security</h2>
          <p>DocuSigner takes reasonable measures to help protect personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
          
          <h2 className="font-headline text-xl font-semibold text-foreground">6. Changes to This Policy</h2>
          <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: privacy@docusigner.com (placeholder email).</p>
        </CardContent>
      </Card>
    </div>
  );
}
