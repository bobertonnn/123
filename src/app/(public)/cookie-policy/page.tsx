
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <Card className="shadow-xl rounded-2xl max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <Cookie className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Cookie Policy</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>This Cookie Policy explains how DocuSigner ("we," "us," or "our") uses cookies and similar technologies when you visit our website or use our Services.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">1. What Are Cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">2. How We Use Cookies</h2>
          <p>We use cookies for several purposes, including:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the Service to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.</li>
            <li><strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our Service. They help us to know which pages are the most and least popular and see how visitors move around the site.</li>
            <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
            <li><strong>Targeting/Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.</li>
          </ul>

          <h2 className="font-headline text-xl font-semibold text-foreground">3. Types of Cookies We Use</h2>
          <p>We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period or until you delete them).</p>
          {/* Placeholder for more specific cookie details if known */}
          <p>Examples of cookies we may use:</p>
          <ul>
            <li>Session Cookies (e.g., for managing your login session).</li>
            <li>Preference Cookies (e.g., to remember your settings and preferences).</li>
            <li>Security Cookies (e.g., for security purposes).</li>
          </ul>

          <h2 className="font-headline text-xl font-semibold text-foreground">4. Your Choices Regarding Cookies</h2>
          <p>You have several options to control or limit how we and our partners use cookies and similar technologies:</p>
          <ul>
            <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.</li>
            <li><strong>Opt-Out Links:</strong> Some third-party analytics and advertising partners offer a means to opt-out of their data collection through their own websites.</li>
          </ul>
          <p>Please note that if you disable cookies, some features of our Service may not operate as intended.</p>

          <h2 className="font-headline text-xl font-semibold text-foreground">5. Changes to This Cookie Policy</h2>
          <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
          
          <h2 className="font-headline text-xl font-semibold text-foreground">6. Contact Us</h2>
          <p>If you have any questions about our use of cookies or other technologies, please email us at: cookies@docusigner.com (placeholder email).</p>
        </CardContent>
      </Card>
    </div>
  );
}
