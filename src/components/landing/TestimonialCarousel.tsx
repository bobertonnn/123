
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  date: string;
  avatarUrl: string;
  tag?: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    quote: "DocuSigner made signing urgent company documents a breeze. The interface is clean and incredibly efficient for our entire team.",
    name: 'Michael S.',
    date: 'March 27, 2024',
    avatarUrl: 'https://placehold.co/80x80.png?text=MS',
    tag: 'Efficiency Boost'
  },
  {
    id: 't2',
    quote: "As a remote team lead, getting contracts signed across time zones was a nightmare. DocuSigner streamlined the entire process for us!",
    name: 'Emily R.',
    date: 'April 24, 2024',
    avatarUrl: 'https://placehold.co/80x80.png?text=ER',
  },
  {
    id: 't3',
    quote: "The security features are top-notch. I feel confident handling sensitive legal documents with DocuSigner for my law firm.",
    name: 'David L.',
    date: 'June 15, 2024',
    avatarUrl: 'https://placehold.co/80x80.png?text=DL',
  },
  {
    id: 't4',
    quote: "Our startup relies on DocuSigner for all our client onboarding. It's saved us countless hours and looks so professional. The mobile signing is a huge plus!",
    name: 'Priya K.',
    date: 'January 10, 2024',
    avatarUrl: 'https://placehold.co/80x80.png?text=PK',
    tag: 'Client Onboarding Simplified'
  },
  {
    id: 't5',
    quote: "We needed a reliable e-signature solution for international agreements. DocuSigner delivered with its ease of use and clear audit trails. Very impressive platform.",
    name: 'Wei Z.',
    date: 'February 05, 2024',
    avatarUrl: 'https://placehold.co/80x80.png?text=WZ',
  }
];

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function TestimonialGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <motion.div
        className="md:col-span-1 md:row-span-2 bg-primary text-primary-foreground p-6 md:p-8 rounded-xl shadow-xl flex flex-col justify-between min-h-[300px] md:min-h-[420px]"
        variants={cardVariants}
        custom={0}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-4xl font-bold">95% Faster</h3>
            <Sparkles className="w-8 h-8 text-primary-foreground/70" />
          </div>
          <p className="text-lg leading-relaxed">
            turnaround on documents processed using DocuSigner, compared to traditional methods.
          </p>
        </div>
      </motion.div>

      {mockTestimonials.map((testimonial, index) => {
        let testimonialGridClasses = '';
        if (index === 0) testimonialGridClasses = 'md:col-start-2 md:row-start-1';
        else if (index === 1) testimonialGridClasses = 'md:col-start-3 md:row-start-1';
        else if (index === 2) testimonialGridClasses = 'md:col-start-2 md:row-start-2';
        else if (index === 3) testimonialGridClasses = 'md:col-start-3 md:row-start-2';
        else if (index === 4) testimonialGridClasses = 'md:col-start-2 md:col-span-2 md:row-start-3'; // New positioning for 5th item

        return (
          <motion.div
            key={testimonial.id}
            className={cn(testimonialGridClasses)}
            variants={cardVariants}
            custom={index + 1} // Adjust custom prop for staggered animation
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-md border border-border/50 shadow-lg rounded-xl h-full flex flex-col">
              <CardContent className="p-6 space-y-3 flex-grow flex flex-col">
                <Quote className="w-8 h-8 text-primary/70 mb-2" />
                <p className="text-sm text-foreground/90 leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="mt-auto pt-3">
                  <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 border-2 border-primary/30">
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                      </div>
                  </div>
                  {testimonial.tag && (
                      <div className="pt-3">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          {testimonial.tag}
                      </span>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
