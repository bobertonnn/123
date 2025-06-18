
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Briefcase, User, Building, Users, Scale, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UseCase {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bgColorClass: string; // For dynamic section background
  accentColorHex: string; // For card accents
}

const useCasesData: UseCase[] = [
  {
    id: 'freelancers',
    icon: User,
    title: 'Freelancers & Solopreneurs',
    description: 'Streamline client agreements, proposals, and invoices. Get paid faster and look professional.',
    bgColorClass: 'from-sky-900/30 to-sky-700/30',
    accentColorHex: 'hsl(var(--chart-1))',
  },
  {
    id: 'smb',
    icon: Briefcase,
    title: 'Small & Medium Businesses',
    description: 'Manage HR documents, sales contracts, vendor agreements, and more with ease and efficiency.',
    bgColorClass: 'from-emerald-900/30 to-emerald-700/30',
    accentColorHex: 'hsl(var(--chart-2))',
  },
  {
    id: 'enterprise',
    icon: Building,
    title: 'Enterprise Solutions',
    description: 'Robust security, compliance features, and scalability for large-scale deployment across departments.',
    bgColorClass: 'from-indigo-900/30 to-indigo-700/30',
    accentColorHex: 'hsl(var(--chart-3))',
  },
  {
    id: 'hr',
    icon: Users,
    title: 'Human Resources',
    description: 'Simplify onboarding, employee contracts, policy acknowledgments, and performance reviews.',
    bgColorClass: 'from-rose-900/30 to-rose-700/30',
    accentColorHex: 'hsl(var(--chart-4))',
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Legal Professionals',
    description: 'Securely sign NDAs, service agreements, legal notices, and retain tamper-proof audit trails.',
    bgColorClass: 'from-slate-900/30 to-slate-700/30',
    accentColorHex: 'hsl(var(--chart-5))',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -30 : 30,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? -30 : 30,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

export function UseCases3D() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    let newIndex = activeIndex + newDirection;
    if (newIndex < 0) {
      newIndex = useCasesData.length - 1;
    } else if (newIndex >= useCasesData.length) {
      newIndex = 0;
    }
    setActiveIndex([newIndex, newDirection]);
  };

  const currentUseCase = useCasesData[activeIndex];
  const Icon = currentUseCase.icon;

  return (
    <motion.section
      className="py-20 sm:py-32 overflow-hidden relative min-h-[700px] flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
      style={{
        background: `linear-gradient(135deg, ${currentUseCase.bgColorClass.split(' ')[0].replace('from-','')} 0%, ${currentUseCase.bgColorClass.split(' ')[1].replace('to-','')} 100%)`,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Palette className="w-4 h-4 mr-2" />
            Tailored For You
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-foreground">
            Versatile Solutions for Every Need
          </h2>
          <p className="text-lg text-muted-foreground md:w-2/3 lg:w-1/2 mx-auto">
            DocuSigner adapts to your specific industry and role, providing specialized features and workflows.
          </p>
        </div>

        <div className="relative h-[400px] max-w-xl mx-auto flex items-center justify-center" style={{ perspective: '1000px' }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-[calc(100%-40px)] sm:w-[380px] h-[380px]"
              whileHover={{ scale: 1.05, rotateY: currentUseCase.id === 'freelancers' ? 5 : (currentUseCase.id === 'legal' ? -5 : 0) }} // Example subtle 3D tilt
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card 
                className="w-full h-full flex flex-col items-center justify-center text-center rounded-2xl shadow-2xl border-2"
                style={{ borderColor: currentUseCase.accentColorHex, background: 'hsla(var(--card), 0.8)' }}
              >
                <CardHeader className="items-center">
                  <div className="p-4 rounded-full mb-4" style={{ backgroundColor: `${currentUseCase.accentColorHex}20`}}> {/* Low opacity accent color */}
                    <Icon className="w-12 h-12" style={{ color: currentUseCase.accentColorHex }} />
                  </div>
                  <CardTitle className="text-2xl font-headline" style={{ color: currentUseCase.accentColorHex }}>{currentUseCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {currentUseCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => paginate(-1)}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm border-foreground/30 text-foreground hover:border-primary hover:text-primary"
            aria-label="Previous use case"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => paginate(1)}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm border-foreground/30 text-foreground hover:border-primary hover:text-primary"
            aria-label="Next use case"
          >
            Next <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
         <div className="flex justify-center mt-8 space-x-2">
          {useCasesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex([index, index > activeIndex ? 1 : -1])}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
                index === activeIndex ? 'bg-primary scale-125 w-4' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              style={{ backgroundColor: index === activeIndex ? currentUseCase.accentColorHex : undefined }}
              aria-label={`Go to use case ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
