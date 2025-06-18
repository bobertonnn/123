
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Eye, ShieldCheck, Zap, BrainCircuit, Calendar, Settings, Rocket } from "lucide-react"; // Added Calendar, Settings, Rocket

const teamMembers = [
  { name: "Alex Johnson", role: "CEO & Founder", avatar: "https://placehold.co/100x100.png?text=AJ", dataAiHint: "man portrait professional" },
  { name: "Maria Garcia", role: "Chief Technology Officer", avatar: "https://placehold.co/100x100.png?text=MG", dataAiHint: "woman face technology" },
  { name: "David Lee", role: "Head of Product", avatar: "https://placehold.co/100x100.png?text=DL", dataAiHint: "man professional smiling" },
  { name: "Sarah Chen", role: "Lead Designer", avatar: "https://placehold.co/100x100.png?text=SC", dataAiHint: "woman asian designer" },
];

const coreValues = [
  { title: "Customer Obsession", description: "We start with the customer and work backwards. We work vigorously to earn and keep customer trust.", icon: Users },
  { title: "Innovation", description: "We expect and require innovation and invention from our teams and find new ways to simplify.", icon: BrainCircuit },
  { title: "Operational Excellence", description: "We strive for operational excellence and look for ways to continuously improve our processes.", icon: Zap },
  { title: "Integrity & Trust", description: "We operate with integrity and build trust through responsible actions and honest relationships.", icon: ShieldCheck },
];

const companyInfoCards = [
    { title: "Founded In", content: "2023", icon: Calendar, dataAiHint: "calendar icon" },
    { title: "Our Vision", content: "To simplify and secure digital document workflows globally.", icon: Rocket, dataAiHint: "rocket launch" },
    { title: "Core Technology", content: "Next.js, React, Tailwind CSS, Genkit AI", icon: Settings, dataAiHint: "gears settings" },
];

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4 space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">About DocuSigner</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We're revolutionizing document workflows, making them simpler, faster, and more secure for everyone.
          At DocuSigner, we believe that managing documents shouldn't be a chore, but a seamless part of your success.
        </p>
      </section>

      <section>
        <Card className="shadow-xl rounded-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {companyInfoCards.map(info => {
                        const InfoIcon = info.icon;
                        return (
                            <Card key={info.title} className="bg-card/50 shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{info.title}</CardTitle>
                                    <InfoIcon className="h-5 w-5 text-muted-foreground" data-ai-hint={info.dataAiHint} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold text-primary">{info.content}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                     <Card className="sm:col-span-2 bg-card/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Our Approach</CardTitle>
                             <BrainCircuit className="h-5 w-5 text-muted-foreground" data-ai-hint="brain circuit" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                We combine cutting-edge technology with user-centric design to deliver an unparalleled document management experience. Continuous improvement and innovation are at the heart of what we do.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-muted/30">
              <div className="flex items-center text-primary mb-3">
                <Target className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                To empower individuals and businesses with an intuitive, secure, and efficient platform for all their document signing and management needs. We aim to eliminate paperwork bottlenecks and foster seamless digital collaboration.
              </p>
              <div className="flex items-center text-primary mb-3 mt-6">
                <Eye className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold font-headline">Our Vision</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To be the leading global solution for digital document transactions, recognized for our innovation, user-centric design, and unwavering commitment to security and trust.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="text-center p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow">
                <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2">{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Meet Our Leadership</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 border-4 border-primary/20">
                <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-primary">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center py-12 bg-muted/30 rounded-2xl">
          <h2 className="text-3xl font-bold font-headline mb-4">Join Us on Our Journey</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We are constantly innovating and looking for passionate individuals to join our team.
            If you believe in the power of technology to simplify lives, DocuSigner might be the place for you.
          </p>
          <a href="/careers" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90">
            Explore Careers
          </a>
      </section>
    </div>
  );
}
