import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, LifeBuoy, MessageSquare, BookOpen } from "lucide-react";

const faqItems = [
  {
    question: "How do I upload a document?",
    answer: "Navigate to the 'Upload Document' page from the sidebar. You can then drag and drop your PDF file or click to browse and select a file from your computer."
  },
  {
    question: "Can I create document templates?",
    answer: "Yes, you can create templates by going to the 'Templates' section and clicking 'Create New Template'. You can upload a base PDF, define signer roles, and place fields."
  },
  {
    question: "How does the signature process work?",
    answer: "After placing fields on a document, you can assign signers. Signers will receive a link to view and sign the document using the signature they created during registration or a new one if signing publicly."
  },
  {
    question: "Is DocuSigner secure?",
    answer: "We prioritize security. Documents are stored securely, and signatures utilize modern cryptographic standards (conceptual for this demo). User authentication and Firebase security rules help protect your data."
  },
   {
    question: "What if I forget my password?",
    answer: "On the Sign In page, click the 'Forgot Password?' link. You'll receive an email with instructions to reset your password (standard Firebase Auth behavior)."
  }
];

export default function HelpPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <HelpCircle className="mr-3 h-8 w-8 text-primary" /> Help & Support
        </h1>
      </div>

      <Card className="mb-8 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about DocuSigner.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search FAQs..." className="pl-10 text-base py-3" />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline text-md font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" /> Knowledge Base
            </CardTitle>
            <CardDescription>Explore detailed guides and tutorials.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary hover:underline">Getting Started with DocuSigner</a></li>
              <li><a href="#" className="text-primary hover:underline">Managing Your Documents</a></li>
              <li><a href="#" className="text-primary hover:underline">Advanced Template Features</a></li>
            </ul>
            <Button variant="outline" className="mt-4 w-full">Browse All Articles</Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" /> Contact Support
            </CardTitle>
            <CardDescription>Can't find what you're looking for? Get in touch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our support team is available to help you with any issues or questions you might have.
            </p>
            <Button className="w-full btn-gradient-hover">
              <LifeBuoy className="mr-2 h-4 w-4" /> <span>Open a Support Ticket</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We typically respond within 24 business hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
