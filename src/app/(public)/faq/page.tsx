
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, LifeBuoy, MessageSquare, BookOpen } from "lucide-react";
import Link from "next/link";

const faqItems = [
  {
    question: "What is DocuSigner?",
    answer: "DocuSigner is a modern platform designed to simplify the process of signing, sending, and managing documents digitally. We aim to make document workflows efficient, secure, and user-friendly."
  },
  {
    question: "How do I upload a document for signing?",
    answer: "Once logged in, navigate to the 'Upload Document' page. You can drag and drop your PDF file or click to browse and select a file from your computer. After uploading, you can add signature fields and assign signers."
  },
  {
    question: "Is DocuSigner secure?",
    answer: "Yes, security is a top priority for us. We use industry-standard encryption (conceptual for this demo) and secure storage for your documents. For authenticated users, Firebase provides robust security features for user data and access control."
  },
  {
    question: "What types of documents can I use with DocuSigner?",
    answer: "Currently, DocuSigner primarily supports PDF documents for uploading and signing."
  },
  {
    question: "Do I need an account to sign a document?",
    answer: "If someone sends you a public signing link, you may not need an account to sign. However, to upload, manage, and send documents yourself, you will need to create a free DocuSigner account."
  },
  {
    question: "Can I create document templates?",
    answer: "Yes, creating and using document templates is a feature available on our Pro and Business plans. Templates help you save time on frequently used documents."
  },
  {
    question: "How can I contact support if I have an issue?",
    answer: "You can visit our Help & Support page (accessible when logged in) or use the 'Contact Us' page for general inquiries. Our support team is ready to assist you."
  }
];

export default function FaqPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <section className="text-center mb-16">
        <HelpCircle className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
          Frequently Asked Questions
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about DocuSigner. If you don't find your answer here, feel free to contact us.
        </p>
      </section>

      <Card className="max-w-3xl mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search FAQs..." className="pl-10 text-base py-3" />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline text-md font-medium py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <section className="mt-20 text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Our team is ready to help. Reach out to us, and we'll get back to you as soon as possible.
        </p>
        <Button asChild size="lg" className="btn-gradient-hover">
          <Link href="/contact">
            <MessageSquare className="mr-2 h-5 w-5" /> Contact Us
          </Link>
        </Button>
      </section>
    </div>
  );
}
