
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface RatingPlatform {
  id: string;
  name: string;
  logoUrl: string; 
  dataAiHint: string;
  rating: number; 
  maxRating?: number; 
  reviewsCount?: string; 
  reviewUrl?: string; // Made optional as we're removing buttons
  accentColor: string; 
}

const platformData: RatingPlatform[] = [
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    logoUrl: 'https://placehold.co/140x45.png?text=Trustpilot+Logo&font=roboto', // Adjusted size & text
    dataAiHint: 'Trustpilot logo',
    rating: 4.8,
    reviewsCount: '2,500+ Reviews',
    reviewUrl: '#', 
    accentColor: 'border-green-500',
  },
  {
    id: 'capterra',
    name: 'Capterra',
    logoUrl: 'https://placehold.co/140x45.png?text=Capterra+Logo&font=lato', // Adjusted size & text
    dataAiHint: 'Capterra logo',
    rating: 4.7,
    reviewsCount: '1,800+ Reviews',
    reviewUrl: '#', 
    accentColor: 'border-blue-500',
  },
  {
    id: 'g2',
    name: 'G2',
    logoUrl: 'https://placehold.co/100x45.png?text=G2+Logo&font=montserrat', // Adjusted size & text
    dataAiHint: 'G2 logo',
    rating: 4.9,
    reviewsCount: '3,200+ Reviews',
    reviewUrl: '#', 
    accentColor: 'border-red-500',
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.4 && rating % 1 < 0.9; // Common threshold for half star
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
      ))}
      {/* For simplicity, not rendering half stars with current icons, adjust if specific half-star icon is available */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400" />
      ))}
    </div>
  );
};

export function PlatformRatings() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {platformData.map((platform, index) => (
        <motion.div
          key={platform.id}
          custom={index}
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="h-full"
        >
          <Card 
            className={`flex flex-col h-full bg-card/70 backdrop-blur-sm border-2 ${platform.accentColor} shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden`}
          >
            <CardHeader className="items-center pt-8 pb-4">
              <div className="h-12 mb-4 flex items-center justify-center">
                <Image 
                    src={platform.logoUrl} 
                    alt={`${platform.name} logo`} 
                    width={140} 
                    height={45} 
                    className="object-contain"
                    data-ai-hint={platform.dataAiHint} 
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center text-center space-y-3 pt-0 pb-8">
              <StarRating rating={platform.rating} />
              <p className="text-3xl font-bold text-foreground">{platform.rating.toFixed(1)} <span className="text-base text-muted-foreground">/ 5</span></p>
              {platform.reviewsCount && (
                <p className="text-sm text-muted-foreground">{platform.reviewsCount}</p>
              )}
              {/* "Read Reviews" button removed as per request */}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
