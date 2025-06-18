
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Zap, ShieldCheck, Clock, Users, FileText, Share2 } from 'lucide-react';
// Removed Image import as it's no longer used
import type { LucideIcon } from 'lucide-react';

interface FeatureSlide {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string; // Used for the left side
  longDescription: string; // Used for the new card on the right
  bgColorClass: string;
}

const features: FeatureSlide[] = [
  {
    id: 'secure-signing',
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'Your documents are protected with advanced encryption and compliance standards.',
    longDescription: 'DocuSigner employs robust security measures, including end-to-end encryption and audit trails, ensuring your sensitive documents remain confidential and tamper-proof throughout the signing process. We adhere to industry best practices for data protection.',
    bgColorClass: 'from-blue-600/20 to-blue-800/20',
  },
  {
    id: 'intuitive-editing',
    icon: FileText,
    title: 'Intuitive Editor',
    description: 'Easily prepare documents with drag-and-drop fields and customizable templates.',
    longDescription: 'Our user-friendly editor allows you to effortlessly upload PDFs, add signature fields, text boxes, dates, and more. Create reusable templates to save time on frequently used documents, all within a clean and intuitive interface.',
    bgColorClass: 'from-green-600/20 to-green-800/20',
  },
  {
    id: 'seamless-collaboration',
    icon: Users,
    title: 'Seamless Collaboration',
    description: 'Invite multiple signers, track progress in real-time, and manage roles efficiently.',
    longDescription: 'Collaborate effortlessly by inviting multiple participants to sign documents. Define signer roles, set signing orders, and monitor the status of each document in real-time from your dashboard. Automated reminders keep everyone on track.',
    bgColorClass: 'from-purple-600/20 to-purple-800/20',
  },
  {
    id: 'public-sharing',
    icon: Share2,
    title: 'Easy Public Sharing',
    description: 'Generate secure public links to collect signatures from external parties effortlessly.',
    longDescription: 'Need to collect a signature from someone outside your organization? Generate a secure, shareable link for your document. External parties can sign without needing an account, making the process smooth and accessible for everyone involved.',
    bgColorClass: 'from-yellow-600/20 to-yellow-800/20',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};


export function InteractiveFeatureSwiper() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const featureIndex = ((page % features.length) + features.length) % features.length;
  const currentFeature = features[featureIndex];
  const Icon = currentFeature.icon;

  return (
    <motion.section
      className="py-20 sm:py-32 bg-background overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Unlock Peak Document Efficiency
        </h2>
        <p className="text-xl text-muted-foreground md:w-3/4 lg:w-2/3 mx-auto mb-12">
          Discover how DocuSigner transforms your document workflows with powerful, intuitive features designed for modern business needs.
        </p>
      </div>

      <div className="container mx-auto relative h-[650px] sm:h-[600px] md:h-[550px] lg:h-[500px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                paginate(1);
              } else if (swipe > 10000) {
                paginate(-1);
              }
            }}
            className={`absolute w-full max-w-4xl bg-gradient-to-br ${currentFeature.bgColorClass} border border-border/30 rounded-2xl shadow-2xl p-6 md:p-10`}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="text-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
                   <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold font-headline mb-3">{currentFeature.title}</h3>
                <p className="text-muted-foreground text-lg mb-6">{currentFeature.description}</p>
                {/* Learn More button removed as per plan */}
              </motion.div>
              <motion.div
                className="relative h-full min-h-[280px] md:min-h-[320px]" // Ensure this div takes up space
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full flex flex-col bg-background/70 backdrop-blur-sm border-border/50 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline text-primary">{currentFeature.title} - In Detail</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {currentFeature.longDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(-1)}
          className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          aria-label="Previous feature"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(1)}
          className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          aria-label="Next feature"
        >
          <ArrowRight />
        </Button>
      </div>
      <div className="flex justify-center mt-8 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setPage([index, index > featureIndex ? 1 : -1])}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === featureIndex ? 'bg-primary scale-125' : 'bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
    </motion.section>
  );
}
