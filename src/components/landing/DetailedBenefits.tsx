
"use client";

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Zap, Lock, BarChart3, Settings, Maximize } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

interface Benefit {
  id: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  longDescription: string;
  chartData?: any[];
  chartConfig?: ChartConfig;
}

const benefitsData: Benefit[] = [
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Unmatched Security',
    shortDescription: 'Bank-grade encryption and robust protocols safeguard your documents at every step.',
    longDescription: 'DocuSigner prioritizes your data security with end-to-end encryption, comprehensive audit trails, and adherence to stringent international compliance standards. Your documents are protected by multiple layers of security, ensuring confidentiality and integrity from upload to final signature and archival.',
  },
  {
    id: 'efficiency',
    icon: Zap,
    title: 'Peak Efficiency',
    shortDescription: 'Streamline your workflows, reduce turnaround times, and boost productivity.',
    longDescription: 'Automate manual tasks, eliminate printing and scanning, and accelerate your document processes. With reusable templates, instant notifications, and real-time tracking, DocuSigner helps your team achieve more in less time, significantly reducing operational bottlenecks.',
    chartData: [
      { month: 'Jan', desktop: 186, mobile: 80 },
      { month: 'Feb', desktop: 305, mobile: 200 },
      { month: 'Mar', desktop: 237, mobile: 120 },
      { month: 'Apr', desktop: 73, mobile: 190 },
      { month: 'May', desktop: 209, mobile: 130 },
      { month: 'Jun', desktop: 214, mobile: 140 },
    ],
    chartConfig: {
      desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
      },
      mobile: {
        label: 'Mobile',
        color: 'hsl(var(--chart-2))',
      },
    } satisfies ChartConfig,
  },
  {
    id: 'control',
    icon: Maximize, // Using Maximize as a metaphor for control/overview
    title: 'Full Control & Visibility',
    shortDescription: 'Manage users, define roles, and track every document action with granular control.',
    longDescription: 'Gain complete oversight of your document ecosystem. DocuSigner provides powerful administrative tools to manage user access, define signing roles and permissions, and maintain detailed audit logs for every interaction. Know who did what, and when, for full compliance and peace of mind.',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function DetailedBenefits() {
  return (
    <motion.section
      className="py-20 sm:py-32 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Settings className="w-4 h-4 mr-2" />
            Core Advantages
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Why DocuSigner Excels
          </h2>
          <p className="text-lg text-muted-foreground md:w-2/3 lg:w-1/2 mx-auto">
            Discover the key benefits that make DocuSigner the preferred choice for modern document management and e-signatures.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-6">
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemVariants}
            >
              <AccordionItem value={benefit.id} className="border border-border/50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card overflow-hidden">
                <AccordionTrigger className="p-6 text-left hover:no-underline group">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold font-headline text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{benefit.shortDescription}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-6">{benefit.longDescription}</p>
                  {benefit.chartData && benefit.chartConfig && (
                    <div className="mt-4 h-[250px] p-4 border rounded-lg bg-muted/30">
                      <ChartContainer config={benefit.chartConfig} className="w-full h-full">
                        <BarChart accessibilityLayer data={benefit.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                          <YAxis tickLine={false} axisLine={false} fontSize={12} />
                          <RechartsTooltip 
                            cursor={false} 
                            content={<ChartTooltipContent indicator="dot" />} 
                          />
                           <RechartsLegend content={<ChartLegendContent />} />
                          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}

