
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Zap, BrainCircuit, Heart, ArrowRight, Send, Star, Lightbulb, Coffee } from "lucide-react"; // Added Star, Lightbulb, Coffee
import Link from "next/link";

const companyPerks = [
  { title: "Innovative Culture", description: "Be part of a team that values creativity and forward-thinking solutions.", icon: BrainCircuit },
  { title: "Growth Opportunities", description: "We invest in our employees' development and offer clear paths for advancement.", icon: Zap },
  { title: "Collaborative Environment", description: "Work with talented and passionate individuals in a supportive setting.", icon: Users },
  { title: "Meaningful Work", description: "Contribute to a product that simplifies lives and empowers businesses.", icon: Heart },
];

const cultureCards = [
    { title: "Our Values", content: "Innovation, Customer Focus, Integrity, Collaboration, and Excellence drive everything we do.", icon: Star },
    { title: "Work Environment", content: "We foster a supportive, inclusive, and dynamic environment where everyone's voice is heard and valued. Enjoy flexible work arrangements and a focus on work-life balance.", icon: Coffee },
    { title: "Impact", content: "Join us to build cutting-edge solutions that make a tangible difference for businesses globally.", icon: Lightbulb },
]

export default function CareersPage() {
  console.log("CareersPage rendering.");
  return (
    <div className="container mx-auto py-12 md:py-20 px-4 space-y-16">
      <section className="text-center">
        <Briefcase className="mx-auto h-16 w-16 text-primary mb-6"/>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">Join Our Team</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          At DocuSigner, we're building the future of document management. We're always looking for talented, driven individuals
          who are passionate about making a difference.
        </p>
      </section>

      <section>
        <Card className="shadow-xl rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold font-headline mb-6">Why Work at DocuSigner?</h2>
                    <div className="space-y-6">
                    {companyPerks.map(perk => {
                        const Icon = perk.icon;
                        return (
                        <div key={perk.title} className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                                <Icon className="h-5 w-5"/>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">{perk.title}</h4>
                                <p className="text-muted-foreground text-sm">{perk.description}</p>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
                 <div className="p-8 md:p-12 flex flex-col justify-center bg-muted/30">
                    <h3 className="text-2xl font-semibold font-headline mb-4">Life at DocuSigner</h3>
                    <div className="space-y-4">
                        {cultureCards.map(card => {
                             const CardIcon = card.icon;
                            return (
                            <Card key={card.title} className="bg-card shadow hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center space-x-3 pb-2 pt-4">
                                     <CardIcon className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="text-sm text-muted-foreground">{card.content}</p>
                                </CardContent>
                            </Card>
                        );
                        })}
                    </div>
                </div>
            </div>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
          Current Openings
        </h2>
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl">
            <CardContent className="p-6 md:p-10 text-center">
                <Briefcase className="mx-auto h-16 w-16 text-primary/70 mb-6"/>
                <CardTitle className="text-2xl font-semibold mb-3">No Open Positions Currently</CardTitle>
                <CardDescription className="text-muted-foreground text-lg max-w-lg mx-auto">
                    We are not actively hiring for specific roles at the moment. However, we are always interested in hearing from talented individuals who believe they can contribute to our mission.
                </CardDescription>
            </CardContent>
        </Card>
      </section>

      <section className="text-center py-12 bg-primary/5 rounded-2xl">
          <h2 className="text-3xl font-bold font-headline mb-4">Think You're a Fit?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            If you're passionate about technology and want to make an impact, we'd love to hear from you.
            Send us your resume and tell us why you'd be a great addition to the DocuSigner team.
          </p>
          <Button asChild size="lg" className="btn-gradient-hover">
            <Link href="mailto:careers@docusigner.com">
              <Send className="mr-2 h-5 w-5" />
              <span>Submit Your Resume</span>
            </Link>
          </Button>
      </section>
    </div>
  );
}
