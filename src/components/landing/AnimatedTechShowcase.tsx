
"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, GitBranchPlus, BrainCircuit, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ShowcaseItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const items: ShowcaseItem[] = [
  { id: 'security', icon: ShieldCheck, title: 'Robust Security', description: 'Fortified with enterprise-grade protection mechanisms.' },
  { id: 'performance', icon: Zap, title: 'Blazing Speed', description: 'Optimized for instant interactions and rapid data processing.' },
  { id: 'scalability', icon: GitBranchPlus, title: 'Seamless Scalability', description: 'Adapts effortlessly to your growing operational demands.' },
  { id: 'innovation', icon: BrainCircuit, title: 'AI-Powered Insights', description: 'Leverage intelligent automation and analytics for smarter decisions.' },
];

const cardVariants = {
  initial: { opacity: 0, y: 50, rotateY: -15 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const iconVariants = {
  rest: { rotate: 0 },
  hover: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 0.4 } }
};

interface Particle {
  id: number;
  style: React.CSSProperties;
  animate: object;
  transition: object;
}

function AnimatedTechShowcase() {
  const [lineParticles, setLineParticles] = useState<Particle[]>([]);
  const [dotParticles, setDotParticles] = useState<Particle[]>([]);
  const [cardAnimateProps, setCardAnimateProps] = useState<Array<{ rotateY: number; duration: number }>>([]);

  useEffect(() => {
    const generatedLines: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      style: {
        position: 'absolute',
        backgroundColor: 'hsl(var(--border) / 0.2)',
        width: '2px',
        height: `${Math.random() * 150 + 50}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg)`,
      },
      animate: {
        opacity: [0, 0.5, 0],
        scale: [0.5, 1.2, 0.5],
        x: Math.random() > 0.5 ? [-20, 20, -20] : [20, -20, 20],
        y: Math.random() > 0.5 ? [-20, 20, -20] : [20, -20, 20],
      },
      transition: {
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        repeatType: "mirror" as "mirror",
        delay: Math.random() * 5,
      }
    }));
    setLineParticles(generatedLines);

    const generatedDots: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i + 30, 
      style: {
        position: 'absolute',
        backgroundColor: 'hsl(var(--primary) / 0.3)',
        borderRadius: '50%',
        width: `${Math.random() * 6 + 3}px`,
        height: `${Math.random() * 6 + 3}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      },
      animate: {
        opacity: [0, 0.8, 0],
        scale: [0.3, 1, 0.3],
        x: Math.random() > 0.5 ? [-30, 30, -30] : [30, -30, 30],
        y: Math.random() > 0.5 ? [-30, 30, -30] : [30, -30, 30],
      },
      transition: {
        duration: Math.random() * 12 + 8,
        repeat: Infinity,
        repeatType: 'loop' as 'loop',
        delay: Math.random() * 6
      }
    }));
    setDotParticles(generatedDots);

    const cardAnimData = items.map(() => ({
        rotateY: Math.random() * 2 - 1,
        duration: 20 + Math.random() * 10,
    }));
    setCardAnimateProps(cardAnimData);

  }, []);


  return (
    <section className="py-20 sm:py-32 bg-background overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {lineParticles.length > 0 && lineParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-border/20" // Ensure className is applied directly if needed, style takes precedence for positioning
            style={particle.style}
            animate={particle.animate}
            transition={particle.transition}
          />
        ))}
        {dotParticles.length > 0 && dotParticles.map((particle) => (
           <motion.div
            key={particle.id}
            className="absolute bg-primary/30 rounded-full" // Ensure className is applied
            style={particle.style}
            animate={particle.animate}
            transition={particle.transition}
           />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Settings className="w-4 h-4 mr-2" />
            Core Technology
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Powered by Cutting-Edge Architecture
          </h2>
          <p className="text-lg text-muted-foreground md:w-2/3 lg:w-1/2 mx-auto mb-16">
            Our platform is built on a foundation of advanced technologies, ensuring reliability, speed, and security for all your document needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative group"
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
              whileHover="hover"
            >
              <motion.div
                className="bg-card/80 backdrop-blur-md border border-border/30 p-6 rounded-2xl shadow-xl h-full flex flex-col items-center text-center transform-style-3d transition-all duration-300 group-hover:scale-110"
                animate={cardAnimateProps[index] ? { rotateY: cardAnimateProps[index].rotateY } : {}}
                transition={cardAnimateProps[index] ? {
                  rotateY: {
                    duration: cardAnimateProps[index].duration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "linear",
                  }
                } : {}}
              >
                <motion.div
                  variants={iconVariants}
                  className="p-4 bg-primary/10 rounded-full inline-block mb-5 ring-2 ring-primary/30 group-hover:ring-primary transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 0.5rem hsl(var(--primary) / 0))',
                  }}
                  whileHover={{
                    scale: 1.1,
                    filter: 'drop-shadow(0 0 1rem hsl(var(--primary) / 0.7))',
                  }}
                >
                  <item.icon className="w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 font-headline text-foreground/90">{item.title}</h3>
                <p className="text-muted-foreground text-sm flex-grow">{item.description}</p>
              </motion.div>
               <motion.div
                className="absolute inset-0 rounded-2xl z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: '0 0 30px 5px hsl(var(--primary) / 0.4), 0 0 15px 0px hsl(var(--accent) / 0.3)',
                }}
               />
            </motion.div>
          ))}
        </div>
      </div>
       <style jsx global>{`
        .perspective {
          perspective: 1500px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}

export default AnimatedTechShowcase;

    