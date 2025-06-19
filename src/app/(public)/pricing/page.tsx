
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    frequency: "/month",
    description: "Get started with essential features, perfect for individuals.",
    features: [
      "Up to 10 documents per month",
      "Basic e-signature",
      "Secure document storage (1GB)",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/auth/signup",
    icon: CheckCircle,
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    frequency: "/month",
    description: "For professionals and small teams needing more power.",
    features: [
      "Unlimited documents",
      "Advanced e-signature options",
      "Reusable templates",
      "Secure document storage (10GB)",
      "Priority email support",
      "Basic audit trails",
    ],
    cta: "Choose Pro",
    href: "/auth/signup?plan=pro", // Example query param
    icon: Zap,
    popular: true,
  },
  {
    name: "Business",
    price: "$45",
    frequency: "/month",
    description: "Comprehensive solution for growing businesses and enterprises.",
    features: [
      "All Pro features",
      "Team management (up to 5 users)",
      "Custom branding",
      "Advanced audit trails & compliance",
      "API Access (coming soon)",
      "Dedicated phone support",
    ],
    cta: "Contact Sales",
    href: "/contact?plan=business", // Example query param
    icon: ShieldCheck,
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
          Find the Right Plan for You
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Simple, transparent pricing. Choose the plan that best fits your needs and start streamlining your document workflows today.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {pricingPlans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <Card
              key={plan.name}
              className={`flex flex-col rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ${plan.popular ? 'border-2 border-primary ring-2 ring-primary/30' : 'border'}`}
            >
              {plan.popular && (
                <div className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-t-xl text-center">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <div className="mb-4 inline-block p-3 bg-primary/10 text-primary rounded-full mx-auto">
                  <PlanIcon className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-xl text-muted-foreground">{plan.frequency}</span>
                </div>
                <CardDescription className="text-md h-12">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 pt-0">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-2">
                <Button asChild className="w-full btn-gradient-hover text-lg py-6">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <section className="mt-20 text-center py-12 bg-muted/30 rounded-2xl">
          <Users className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold font-headline mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            For larger organizations or specific requirements, we offer tailored enterprise plans. 
            Contact our sales team to discuss your needs.
          </p>
          <Button asChild size="lg" className="btn-cta-secondary-emerald">
            <Link href="/contact">
              <span>Contact Sales</span>
            </Link>
          </Button>
      </section>
    </div>
  );
}
