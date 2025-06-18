
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Clock, CalendarCheck2 } from "lucide-react"; // Added Clock, CalendarCheck2

export default function ContactUsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">Get In Touch</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help and answer any question you might have. We look forward to hearing from you!
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Send Us a Message</CardTitle>
            <CardDescription>Fill out the form and our team will get back to you shortly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Regarding..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message here..." rows={5} />
            </div>
            <Button type="submit" className="w-full btn-gradient-hover">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Mail className="w-8 h-8 text-primary mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                  <a href="mailto:support@docusigner.com" className="text-muted-foreground hover:text-primary">support@docusigner.com</a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pl-12">For general inquiries and support.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Phone className="w-8 h-8 text-primary mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">Call Us</h3>
                  <p className="text-muted-foreground">+1 (555) 123-DOCU (3628)</p>
                </div>
              </div>
               <p className="text-sm text-muted-foreground pl-12">For sales and urgent matters.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <MapPin className="w-8 h-8 text-primary mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">Our Office</h3>
                  <p className="text-muted-foreground">123 Innovation Drive, Suite 404<br/>Tech City, CA 94000, USA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                <Clock className="w-6 h-6 text-primary" data-ai-hint="clock icon" />
                <CardTitle className="text-lg font-semibold">Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Monday - Friday: <strong>9:00 AM - 6:00 PM (UTC)</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Closed on public holidays.
                </p>
            </CardContent>
          </Card>
           <Card className="shadow-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                <CalendarCheck2 className="w-6 h-6 text-primary" data-ai-hint="calendar check" />
                <CardTitle className="text-lg font-semibold">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    We typically respond to inquiries within <strong>24 business hours</strong>.
                </p>
                 <p className="text-sm text-muted-foreground mt-1">
                    For urgent issues, please call us during operating hours.
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
