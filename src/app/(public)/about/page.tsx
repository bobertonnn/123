
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Eye, Zap, Lightbulb, TrendingUp } from "lucide-react"; // Added Lightbulb, TrendingUp

const teamMembers = [
  { name: "Alice Wonderland", role: "CEO & Visionary", avatar: "https://placehold.co/100x100.png?text=AW" },
  { name: "Bob The Builder", role: "CTO & Lead Architect", avatar: "https://placehold.co/100x100.png?text=BB" },
  { name: "Charlie Brown", role: "Head of Product", avatar: "https://placehold.co/100x100.png?text=CB" },
];

const coreValues = [
  { title: "Innovation", description: "We constantly seek new ways to solve problems and improve our platform.", icon: Lightbulb },
  { title: "Customer Focus", description: "Our users are at the heart of everything we do. We listen and adapt.", icon: Users },
  { title: "Integrity", description: "We operate with transparency and honesty in all our interactions.", icon: Target },
  { title: "Excellence", description: "We strive for the highest quality in our product, support, and operations.", icon: Zap },
];


export default function AboutUsPage() {
  console.log("AboutUsPage rendering.");
  return (
    <div className="container mx-auto px-4 space-y-16">
      <section className="text-center py-12 md:py-16">
        <TrendingUp className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">About DocuSigner</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are passionate about simplifying document workflows and empowering businesses with modern, secure, and efficient e-signature solutions.
        </p>
      </section>

      <section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-3xl font-headline">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-lg leading-relaxed">
              To provide an intuitive, reliable, and accessible platform that transforms how individuals and organizations manage and sign documents, saving time and resources while ensuring security and compliance.
            </CardContent>
          </Card>
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <Eye className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-3xl font-headline">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-lg leading-relaxed">
              To be the leading global provider of e-signature solutions, recognized for innovation, user-centric design, and unwavering commitment to data security and customer success.
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="text-center shadow-lg rounded-xl hover:shadow-primary/20 hover:shadow-xl transition-shadow">
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3 inline-block">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Meet Our (Conceptual) Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center shadow-lg rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/50">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
              <p className="text-primary">{member.role}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
