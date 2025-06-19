
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, UploadCloud, PenTool, FileText as FileTextIconLucide, Move, Link2, Activity, Settings, Palette as PaletteIcon, Maximize, Briefcase, User as UserIcon, Building, Scale as ScaleIcon, Layers, Zap, ShieldCheck, BrainCircuit, Server, FileText, ArrowUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, useScroll, useTransform, type MotionValue, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { CompanyTicker } from '@/components/landing/CompanyTicker';
import { InteractiveFeatureSwiper } from '@/components/landing/InteractiveFeatureSwiper';
import AnimatedTechShowcase from '@/components/landing/AnimatedTechShowcase';
import { DetailedBenefits } from '@/components/landing/DetailedBenefits';
import { UseCases3D } from '@/components/landing/UseCases3D';
import { TestimonialGrid } from '@/components/landing/TestimonialCarousel';
import React, { useRef, useState, useEffect, type MouseEvent, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';


const heroTitleSegments = [
  { type: 'group', words: ["Sign.", "Send."], gradientClass: "from-primary to-accent" },
  { type: 'single', word: "Succeed.", gradientClass: "" },
];


const heroFeatures = [
  { title: "Seamless PDF Uploads", icon: UploadCloud, hint: "file upload icon", shortDescription: "Drag, drop, and you're set.", longDescription: "Effortlessly upload your PDF documents using our intuitive drag-and-drop interface or by selecting files directly from your computer. Our system processes your files quickly, preparing them for signature placement, field assignments, and secure sharing, ensuring a smooth start to your document workflow. We support various PDF versions and ensure compatibility across devices." },
  { title: "Intuitive Signature Fields", icon: PenTool, hint: "pen tool icon", shortDescription: "Place signatures with precision.", longDescription: "Add signature, initial, date, and text fields to your documents with pixel-perfect precision. Our visual editor makes it simple to define exactly where participants need to interact. Assign fields to specific signer roles to guide them through the document efficiently. Customizable field properties allow for required inputs, formatting, and conditional logic." },
  { title: "Reusable Templates", icon: FileTextIconLucide, hint: "document icon", shortDescription: "Standardize common documents.", longDescription: "Save significant time by creating and managing reusable templates for your frequently used documents like NDAs, sales contracts, or employee onboarding forms. Pre-set fields and signer roles to expedite the sending process and ensure consistency across all your agreements. Update templates easily and track version history." },
];

const whyDocuSignerFeatures = [
  { title: "Easy PDF Uploads", description: "Quickly upload your documents in PDF format.", icon: LucideIcons.UploadCloud, hint: "file upload" },
  { title: "Visual Signature Capture", description: "Draw your signature directly on the platform.", icon: LucideIcons.PenTool, hint: "signature drawing" },
  { title: "Drag & Drop Fields", description: "Place signature, date, and text fields intuitively.", icon: LucideIcons.Move, hint: "user interface" },
  { title: "Document Templates", description: "Create reusable templates for common documents.", icon: LucideIcons.FileText, hint: "document template" },
  { title: "Public Share Links", description: "Generate links to collect signatures from anyone.", icon: LucideIcons.Link2, hint: "sharing link" },
  { title: "Trackable Progress", description: "Monitor document status in real-time.", icon: LucideIcons.Activity, hint: "progress chart" },
];


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const letterVariant = {
  initial: { opacity: 0, y: 20, rotate: -10 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: "easeOut",
    }
  }),
};

const cardFadeInUp = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface HeroParticleConfig {
  id: number;
  type: 'circle' | 'square';
  initialX: string;
  initialY: string;
  size: string;
  colorClass: string;
  scrollFactorX: number;
  scrollFactorY: number;
  opacityRange: [number, number, number, number];
  scaleRange: [number, number, number];
  blur?: string;
}

function AnimatedHeroParticle({ config, scrollYProgress }: { config: HeroParticleConfig; scrollYProgress: MotionValue<number> }) {
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `${config.scrollFactorX * 80}%`]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${config.scrollFactorY * 80}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], config.opacityRange);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], config.scaleRange);

  return (
    <motion.div
      className={`absolute ${config.colorClass} ${config.size} ${config.blur || ''} ${config.type === 'circle' ? 'rounded-full' : 'rounded-sm'}`}
      style={{
        left: config.initialX,
        top: config.initialY,
        x,
        y,
        opacity,
        scale,
        transformOrigin: 'center',
      }}
      aria-hidden="true"
    />
  );
}

interface GeometricShapeConfig {
  id: number;
  type: 'line' | 'circle' | 'rect';
  colorClass: string;
  size: { width: string; height: string };
  initialX: string;
  initialY: string;
  initialRotation?: number;
  animate?: boolean;
  scrollFactorX?: number;
  scrollFactorY?: number;
  scrollFactorRotate?: number;
  opacityRange?: [number, number, number, number];
  scaleRange?: [number, number, number];
  blur?: string;
}

function StaticGeometricShape({ config }: { config: GeometricShapeConfig }) {
  return (
    <div
      className={`absolute ${config.colorClass} ${config.blur || ''}`}
      style={{
        width: config.size.width,
        height: config.size.height,
        left: config.initialX,
        top: config.initialY,
        transform: `rotate(${config.initialRotation || 0}deg)`,
        borderRadius: config.type === 'circle' ? '50%' : config.type === 'rect' ? '0.25rem' : '0',
        opacity: config.opacityRange ? config.opacityRange[1] : 0.3, 
      }}
      aria-hidden="true"
    />
  );
}

function AnimatedGeometricShape({ config, scrollYProgress }: { config: GeometricShapeConfig; scrollYProgress: MotionValue<number> }) {
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `${(config.scrollFactorX || 0) * 50}%`]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${(config.scrollFactorY || 0) * 50}%`]);
  const rotate = useTransform(scrollYProgress, [0, 1], [config.initialRotation || 0, (config.initialRotation || 0) + (config.scrollFactorRotate || 0)]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], config.opacityRange || [0, 0.4, 0.4, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], config.scaleRange || [1, 1.1, 1]);

  return (
    <motion.div
      className={`absolute ${config.colorClass} ${config.blur || ''}`}
      style={{
        width: config.size.width,
        height: config.size.height,
        left: config.initialX,
        top: config.initialY,
        x,
        y,
        rotate,
        opacity,
        scale,
        borderRadius: config.type === 'circle' ? '50%' : config.type === 'rect' ? '0.25rem' : '0',
        transformOrigin: 'center',
      }}
      aria-hidden="true"
    />
  );
}

interface NetworkLineConfig {
  id: number;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  colorClass: string;
  thickness: string;
  opacityRange: [number, number, number, number];
}

function NetworkLineParticle({ config, scrollYProgress }: { config: NetworkLineConfig; scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], config.opacityRange);
  const dX = useTransform(scrollYProgress, [0, 1], [0, (Math.random() - 0.5) * 20]);
  const dY = useTransform(scrollYProgress, [0, 1], [0, (Math.random() - 0.5) * 20]);

  return (
    <motion.svg
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity,
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      <motion.line
        x1={config.startX}
        y1={config.startY}
        x2={`calc(${config.endX} + ${dX.get()}px)`}
        y2={`calc(${config.endY} + ${dY.get()}px)`}
        className={config.colorClass}
        strokeWidth={config.thickness}
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

interface AnimatedRingConfig {
  id: number;
  cx: string;
  cy: string;
  r: number;
  strokeWidth: number;
  strokeDasharray?: string;
  strokeColorClass: string;
  initialRotation: number;
  rotationSpeedFactor: number;
  opacityRange: [number, number, number, number];
  scaleRange: [number, number, number];
}

function AnimatedRingParticle({ config, scrollYProgress }: { config: AnimatedRingConfig; scrollYProgress: MotionValue<number> }) {
  const rotate = useTransform(scrollYProgress, [0, 1], [config.initialRotation, config.initialRotation + 360 * config.rotationSpeedFactor]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], config.opacityRange);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], config.scaleRange);
  const centerOffset = config.r + config.strokeWidth / 2;

  return (
    <motion.svg
      className="absolute overflow-visible"
      style={{
        left: config.cx,
        top: config.cy,
        width: config.r * 2 + config.strokeWidth,
        height: config.r * 2 + config.strokeWidth,
        x: `-${centerOffset}px`,
        y: `-${centerOffset}px`,
        opacity,
        scale,
        rotate,
        transformOrigin: 'center',
      }}
      viewBox={`0 0 ${config.r * 2 + config.strokeWidth} ${config.r * 2 + config.strokeWidth}`}
      aria-hidden="true"
    >
      <circle
        cx={centerOffset}
        cy={centerOffset}
        r={config.r}
        strokeWidth={config.strokeWidth}
        className={config.strokeColorClass}
        fill="none"
        strokeDasharray={config.strokeDasharray || "none"}
      />
    </motion.svg>
  );
}


const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (typeof window !== 'undefined' && window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);
      return () => {
        window.removeEventListener('scroll', toggleVisibility);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 btn-gradient-hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

interface PdfLineStyle {
  initialWidth: string;
}


const initialPdfLineStyles: PdfLineStyle[] = Array.from({ length: 12 }).map((_, i) => ({
  initialWidth: i % 4 === 0 ? '100%' : i % 4 === 1 ? '85%' : i % 4 === 2 ? '50%' : '90%',
}));


export default function LandingPage() {
  const textShadowStyle = {
    color: 'hsl(var(--foreground))',
    textShadow: `
      1px 1px 0px hsl(var(--primary)),
      1px 1px 1px hsla(var(--foreground), 0.7)
    `,
  };

  const featureTitleShadowStyle = {
    textShadow: '1px 1px 1px hsl(var(--background))'
  };

  const [isClient, setIsClient] = useState(false);
  const [pdfTextLineStyles] = useState<PdfLineStyle[]>(initialPdfLineStyles);


  const heroSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start end", "end start"]
  });

  const whyDocuSignerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: whyDocuSignerScrollYProgress } = useScroll({
    target: whyDocuSignerRef,
    offset: ["start end", "end start"]
  });

  const detailedBenefitsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: detailedBenefitsScrollYProgress } = useScroll({
    target: detailedBenefitsRef,
    offset: ["start end", "end start"]
  });

  const animatedTechShowcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: animatedTechShowcaseScrollYProgress } = useScroll({
    target: animatedTechShowcaseRef,
    offset: ["start end", "end start"]
  });

  const useCasesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: useCasesScrollYProgress } = useScroll({
    target: useCasesRef,
    offset: ["start end", "end start"]
  });

  const testimonialSectionRef = useRef<HTMLDivElement>(null);
   const { scrollYProgress: testimonialScrollYProgress } = useScroll({
    target: testimonialSectionRef,
    offset: ["start end", "end start"]
  });


  const [heroParticlesConfig, setHeroParticlesConfig] = useState<HeroParticleConfig[]>([]);
  const [whyDocuSignerGeometricsConfig, setWhyDocuSignerGeometricsConfig] = useState<GeometricShapeConfig[]>([]);
  const [detailedBenefitsGeometricsConfig, setDetailedBenefitsGeometricsConfig] = useState<GeometricShapeConfig[]>([]);
  const [techShowcaseRingsConfig, setTechShowcaseRingsConfig] = useState<AnimatedRingConfig[]>([]);
  const [useCasesNetworkLinesConfig, setUseCasesNetworkLinesConfig] = useState<NetworkLineConfig[]>([]);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 25, mass: 1 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const MAX_ROTATION = 45;

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    if (!pdfContainerRef.current) return;
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    const newRotateY = (mouseX / (rect.width / 2)) * MAX_ROTATION;
    const newRotateX = -(mouseY / (rect.height / 2)) * MAX_ROTATION;
    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  }, [rotateX, rotateY]); 

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const currentPdfContainer = pdfContainerRef.current;
      if (currentPdfContainer) {
        currentPdfContainer.addEventListener('mousemove', handleMouseMove);
        currentPdfContainer.addEventListener('mouseleave', handleMouseLeave);
      }

      const heroParticles: HeroParticleConfig[] = Array.from({ length: 60 }).map((_, i) => ({
        id: i, type: Math.random() > 0.5 ? 'circle' : 'square', initialX: `${Math.random() * 100}%`, initialY: `${Math.random() * 100}%`,
        size: `w-${Math.floor(Math.random() * 3) + 1} h-${Math.floor(Math.random() * 3) + 1}`,
        colorClass: i % 3 === 0 ? 'bg-primary/30' : i % 3 === 1 ? 'bg-accent/30' : 'bg-foreground/20',
        scrollFactorX: (Math.random() - 0.5) * 0.8, scrollFactorY: (Math.random() - 0.5) * 1.2,
        opacityRange: [0, Math.random() * 0.3 + 0.3, Math.random() * 0.3 + 0.3, 0],
        scaleRange: [0.5, Math.random() * 0.6 + 0.7, 0.5],
        blur: Math.random() > 0.4 ? (Math.random() > 0.6 ? 'blur-sm' : 'blur-xs') : '',
      }));
      setHeroParticlesConfig(heroParticles);

      const whyGeometrics: GeometricShapeConfig[] = Array.from({ length: 12 }).map((_, i) => {
        const type = ['line', 'circle', 'rect'][Math.floor(Math.random() * 3)] as 'line' | 'circle' | 'rect';
        return {
          id: i + 100, type, colorClass: i % 2 === 0 ? 'bg-primary/40' : 'bg-accent/40',
          size: type === 'line' ? { width: `${Math.random() * 80 + 40}px`, height: '2px' } : { width: `${Math.random() * 30 + 15}px`, height: `${Math.random() * 30 + 15}px` },
          initialX: `${Math.random() * 90}%`, initialY: `${Math.random() * 90}%`, initialRotation: Math.random() * 360, animate:true,
          scrollFactorX: (Math.random() - 0.5) * 0.7, scrollFactorY: (Math.random() - 0.5) * 0.7,
          scrollFactorRotate: (Math.random() - 0.5) * 150,
          opacityRange: [0, Math.random() * 0.25 + 0.2, Math.random() * 0.25 + 0.2, 0],
          scaleRange: [0.8, Math.random() * 0.3 + 0.9, 0.8], blur: Math.random() > 0.6 ? 'blur-xs' : '',
        };
      });
      setWhyDocuSignerGeometricsConfig(whyGeometrics);

      const detailedGeometrics: GeometricShapeConfig[] = Array.from({ length: 15 }).map((_, i) => {
        const type = ['line', 'circle', 'rect'][Math.floor(Math.random() * 3)] as 'line' | 'circle' | 'rect';
        const animate = Math.random() > 0.4;
        return {
          id: i, type, colorClass: i % 3 === 0 ? 'bg-primary/60' : i % 3 === 1 ? 'bg-accent/60' : 'bg-foreground/50',
          size: type === 'line' ? { width: `${Math.random() * 120 + 60}px`, height: '3px' } : { width: `${Math.random() * 40 + 25}px`, height: `${Math.random() * 40 + 25}px` },
          initialX: `${Math.random() * 90}%`, initialY: `${Math.random() * 90}%`, initialRotation: Math.random() * 360, animate,
          scrollFactorX: animate ? (Math.random() - 0.5) * 0.9 : undefined, scrollFactorY: animate ? (Math.random() - 0.5) * 0.9 : undefined,
          scrollFactorRotate: animate ? (Math.random() - 0.5) * 200 : undefined,
          opacityRange: animate ? [0, Math.random() * 0.3 + 0.35, Math.random() * 0.3 + 0.35, 0] : [0.5, 0.5, 0.5, 0.5],
          scaleRange: animate ? [1, Math.random() * 0.35 + 1, 1] : [1,1,1], blur: Math.random() > 0.5 ? 'blur-sm' : 'blur-xs',
        };
      });
      setDetailedBenefitsGeometricsConfig(detailedGeometrics);


      const rings: AnimatedRingConfig[] = Array.from({ length: 40 }).map((_, i) => ({
        id: i, cx: `${Math.random() * 90 + 5}%`, cy: `${Math.random() * 90 + 5}%`, r: Math.random() * 60 + 20,
        strokeWidth: Math.random() * 0.5 + 1,
        strokeDasharray: ["1 2", "2 4", "3 5"][Math.floor(Math.random()*3)],
        strokeColorClass: ['stroke-foreground/10', 'stroke-foreground/15', 'stroke-foreground/20'][Math.floor(Math.random() * 3)],
        initialRotation: Math.random() * 360, rotationSpeedFactor: (Math.random() - 0.5) * 0.7,
        opacityRange: [0, Math.random() * 0.1 + 0.05, Math.random() * 0.1 + 0.05, 0],
        scaleRange: [0.9, Math.random() * 0.2 + 1, 0.9],
      }));
      setTechShowcaseRingsConfig(rings);

      const networkLines: NetworkLineConfig[] = Array.from({ length: 25 }).map((_, i) => ({
        id: i, startX: `${Math.random() * 100}%`, startY: `${Math.random() * 100}%`, endX: `${Math.random() * 100}%`, endY: `${Math.random() * 100}%`,
        colorClass: Math.random() > 0.6 ? 'stroke-primary/30' : 'stroke-accent/30', thickness: `${Math.random() * 1.5 + 0.5}px`,
        opacityRange: [0, Math.random() * 0.1 + 0.1, Math.random() * 0.1 + 0.1, 0],
      }));
      setUseCasesNetworkLinesConfig(networkLines);

      return () => {
        if (currentPdfContainer) {
          currentPdfContainer.removeEventListener('mousemove', handleMouseMove);
          currentPdfContainer.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, [isClient, handleMouseMove, handleMouseLeave]);

  let letterAnimationIndex = 0;

  return (
    <>
      <ScrollToTopButton />
      <motion.section
        ref={heroSectionRef}
        className="container relative mx-auto grid place-items-center py-20 md:py-32 gap-10"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {isClient && heroParticlesConfig.map(p => (
            <AnimatedHeroParticle key={p.id} config={p} scrollYProgress={heroScrollYProgress} />
          ))}
        </div>

        <motion.div
          className="lg:col-span-2 text-center space-y-6 flex flex-col items-center relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
              className="text-5xl md:text-6xl font-bold font-headline"
              aria-label="Sign. Send. Succeed. with DocuSigner"
              variants={fadeInUp}
            >
              {heroTitleSegments.map((segment, segmentIndex) => {
                if (segment.type === 'group') {
                  return (
                    <span key={segmentIndex} className={`inline-block mr-3 ${segment.gradientClass ? `bg-gradient-to-r ${segment.gradientClass} bg-clip-text text-transparent` : ''}`}>
                      {segment.words.map((word, wordIndexInGroup) => (
                        <React.Fragment key={wordIndexInGroup}>
                          {word.split("").map((letter, letterIndex) => {
                            const currentDelayIndex = letterAnimationIndex++;
                            return (
                              <motion.span
                                key={`${segmentIndex}-${wordIndexInGroup}-${letterIndex}`}
                                custom={currentDelayIndex}
                                variants={letterVariant}
                                className={`inline-block ${letter === " " ? "mx-1" : ""}`}
                              >
                                {letter}
                              </motion.span>
                            );
                          })}
                          {wordIndexInGroup < segment.words.length - 1 && <span className="mx-1">&nbsp;</span>}
                        </React.Fragment>
                      ))}
                    </span>
                  );
                } else { // single
                  return (
                    <span key={segmentIndex} className="inline-block mr-3">
                      {segment.word.split("").map((letter, letterIndex) => {
                        const currentDelayIndex = letterAnimationIndex++;
                        return (
                          <motion.span
                            key={`${segmentIndex}-${letterIndex}`}
                            custom={currentDelayIndex}
                            variants={letterVariant}
                            className={`inline-block ${letter === " " ? "mx-1" : ""} ${segment.gradientClass ? `bg-gradient-to-r ${segment.gradientClass} bg-clip-text text-transparent` : 'text-foreground'}`}
                          >
                            {letter}
                          </motion.span>
                        );
                      })}
                    </span>
                  );
                }
              })}
                with DocuSigner
            </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground md:w-10/12 mx-auto"
          >
            The simplest, most secure way to manage your digital documents. Upload, sign, and track with ease.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2 w-full max-w-md"
          >
            <Button asChild className="btn-cta-primary-emerald" size="lg">
                <Link href="/auth/signup">
                  <span>
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Link>
            </Button>

            <Button asChild className="btn-cta-secondary-emerald" size="lg">
              <Link href="/dashboard">
                  <span>
                  <span>View Demo</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-2 w-full mt-16 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <motion.div
              className="relative group"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              <div className="absolute -inset-2.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <Card className="relative shadow-2xl rounded-xl bg-card/80 backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-3xl font-headline text-center" style={textShadowStyle}>
                    DocuSigner Core Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 p-4 md:p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {heroFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <AccordionItem value={`item-${index}`} key={feature.title} className="border-b-0 mb-2 last:mb-0">
                          <motion.div
                            initial={{ opacity:0, x: -20 }}
                            animate={{ opacity:1, x: 0 }}
                            transition={{ duration:0.4, delay: 0.5 + index * 0.1 }}
                          >
                            <AccordionTrigger className="p-3 bg-muted/30 hover:bg-muted/60 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:border-primary/50 border border-transparent hover:scale-[1.02] [&[data-state=open]>svg]:text-primary">
                              <div className="flex items-start space-x-3 text-left">
                                <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground" style={featureTitleShadowStyle}>{feature.title}</h3>
                                  <p className="text-sm text-muted-foreground">{feature.shortDescription}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-3 pt-2 text-sm text-muted-foreground bg-muted/10 rounded-b-lg">
                              {feature.longDescription}
                            </AccordionContent>
                          </motion.div>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  <Button variant="link" className="w-full text-primary hover:text-primary/80 pt-3" asChild>
                      <Link href="#features">
                          <span className="inline-flex items-center">
                              <span>And many more... </span>
                              <ArrowRight className="ml-1 h-4 w-4" />
                          </span>
                      </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              ref={pdfContainerRef}
              className="relative flex items-center justify-center h-[400px] md:h-[450px] group perspective"
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
            >
              <motion.div
                className="relative transform-style-preserve-3d"
                style={{ rotateX: springRotateX, rotateY: springRotateY, scale: 1.05 }}
              >
                <div
                  className="absolute w-[280px] h-[380px] bg-card/60 border border-border/30 rounded-lg shadow-sm backface-hidden"
                  style={{ transform: 'rotateY(15deg) translateZ(-20px) translateY(10px)' }}
                />
                <div
                  className="absolute w-[280px] h-[380px] bg-card/80 border border-border/50 rounded-lg shadow-md backface-hidden"
                  style={{ transform: 'rotateY(10deg) translateZ(-10px) translateY(5px)' }}
                />
                <div
                  className="relative w-[280px] h-[380px] bg-card border border-border rounded-lg shadow-xl p-6 flex flex-col transform-style-preserve-3d overflow-hidden backface-hidden"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <FileTextIconLucide className="w-6 h-6 text-primary" />
                    <span className="font-code text-sm font-medium text-foreground">DocuSigner.pdf</span>
                  </div>
                  <div className="space-y-2 mb-4 flex-grow">
                    {isClient && pdfTextLineStyles.map((style, i) => (
                      <motion.div
                        key={i}
                        className={`h-2 rounded-sm ${
                          i % 4 === 0 ? 'bg-primary/70' :
                          i % 4 === 1 ? 'bg-accent/70' :
                          i % 4 === 2 ? 'bg-muted-foreground/60' :
                          'bg-muted-foreground/50'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: style.initialWidth }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.05, ease: "circOut" }}
                      />
                    ))}
                  </div>
                  <div className="mt-auto flex justify-end">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <PenTool className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

      </motion.section>

      <motion.section>
        <CompanyTicker />
      </motion.section>

      <motion.section ref={animatedTechShowcaseRef} className="py-20 sm:py-32 relative">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {isClient && techShowcaseRingsConfig.map(ring => (
            <AnimatedRingParticle key={ring.id} config={ring} scrollYProgress={animatedTechShowcaseScrollYProgress} />
          ))}
        </div>
        <AnimatedTechShowcase />
      </motion.section>

      <motion.section
        ref={detailedBenefitsRef}
        className="py-20 sm:py-32 relative"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {isClient && detailedBenefitsGeometricsConfig.map(shape => (
            shape.animate ? (
              <AnimatedGeometricShape key={shape.id} config={shape} scrollYProgress={detailedBenefitsScrollYProgress} />
            ) : (
              <StaticGeometricShape key={shape.id} config={shape} />
            )
          ))}
        </div>
        <DetailedBenefits />
      </motion.section>

      <motion.section
          ref={useCasesRef}
          className="transition-all duration-700 ease-in-out"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {isClient && useCasesNetworkLinesConfig.map(line => (
            <NetworkLineParticle key={line.id} config={line} scrollYProgress={useCasesScrollYProgress} />
          ))}
        </div>
        <UseCases3D />
      </motion.section>

      <motion.section>
        <InteractiveFeatureSwiper />
      </motion.section>


      <motion.section
          id="features"
          ref={whyDocuSignerRef}
          className="py-20 sm:py-32 relative"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {isClient && whyDocuSignerGeometricsConfig.map(shape => (
              <AnimatedGeometricShape key={shape.id} config={shape} scrollYProgress={whyDocuSignerScrollYProgress} />
            ))}
        </div>
        <div className="container mx-auto space-y-16 relative z-10">
          <motion.div
            className="text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold font-headline">Why DocuSigner?</motion.h2>
            <motion.p
              variants={fadeInUp}
              className="md:w-2/3 lg:w-1/2 mx-auto mt-4 text-lg text-muted-foreground"
            >
              Experience a seamless document workflow designed for modern businesses, packed with features to enhance your productivity.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {whyDocuSignerFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="p-0.5 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent group"
                  variants={cardFadeInUp}
                  custom={index}
                >
                  <motion.div
                    className="bg-card/80 backdrop-blur-md border border-border/20 p-6 md:p-8 rounded-[15px] shadow-xl h-full flex flex-col items-start text-left transition-all duration-300 group-hover:border-primary/50"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0px 10px 30px -5px hsl(var(--primary) / 0.3)",
                      transition: { duration: 0.2, ease: "circOut" }
                    }}
                  >
                    <motion.div
                      className="p-3 bg-primary/10 rounded-lg mb-5 inline-block ring-2 ring-primary/0 group-hover:ring-primary/30 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-2 font-headline text-foreground/90" style={featureTitleShadowStyle}>{feature.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{feature.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

        <motion.section
          ref={testimonialSectionRef}
          className="py-20 md:py-32 bg-background relative overflow-hidden"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
              {isClient && heroParticlesConfig.slice(0,20).map(p => (
              <AnimatedHeroParticle key={`testimonial-particle-${p.id}`} config={{...p, scrollFactorY: (Math.random() - 0.5) * 0.5, opacityRange: [0, Math.random()*0.1+0.1, Math.random()*0.1+0.1, 0]}} scrollYProgress={testimonialScrollYProgress} />
              ))}
          </div>
          <div className="container mx-auto text-center relative z-10">
              <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold font-headline mb-6"
              >
                  Loved by Users Worldwide
              </motion.h2>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl text-muted-foreground md:w-2/3 mx-auto mb-12"
              >
                  Discover what our clients are saying about their DocuSigner experience.
              </motion.p>
                <TestimonialGrid />
          </div>
      </motion.section>

        <motion.section
          className="py-20 md:py-32 bg-background relative overflow-hidden"
      >
          <div className="container mx-auto text-center relative z-10">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={fadeInUp}
                >
                  <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                      Ready to Simplify Your Documents?
                  </h2>
                  <p className="text-xl text-muted-foreground md:w-2/3 mx-auto mb-10">
                      Join thousands of users streamlining their workflow with DocuSigner.
                      Sign up for free and experience the future of document management today.
                  </p>
                  <Button className="btn-cta-primary-emerald px-10 py-6 text-lg" asChild>
                      <Link href="/auth/signup">
                            <span>
                              <span>Start Free Trial</span>
                              <ArrowRight className="ml-2 h-5 w-5" />
                          </span>
                      </Link>
                  </Button>
              </motion.div>
          </div>
      </motion.section>
    </>
  );
}
      
