"use client";

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const companies = [
  { name: "FACEBOOK" }, { name: "UPS" }, { name: "FEDEX" }, 
  { name: "TESLA" }, { name: "BIOGEN" }, { name: "MERCK" },
  { name: "BEST BUY" }, { name: "NVIDIA" }, { name: "NETFLIX" },
  { name: "SALESFORCE" }, { name: "ADOBE" }, { name: "ORACLE" }
];

// Duplicate for seamless loop
const duplicatedCompanies = [...companies, ...companies];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CompanyTicker() {
  return (
    <motion.section 
      className="py-16 sm:py-24 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
          <Briefcase className="w-4 h-4 mr-2" />
          Global Trust
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
          Trusted by Leading Companies Worldwide
        </h2>
        <p className="text-lg text-muted-foreground md:w-2/3 lg:w-1/2 mx-auto mb-12">
          DocuSigner powers businesses of all sizes, from innovative startups to Fortune 500 enterprises, to streamline their document workflows.
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-content">
              {duplicatedCompanies.map((company, index) => (
                <div key={index} className="company-logo-text">
                  {company.name}
                </div>
              ))}
            </div>
          </div>
           <div 
            className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div 
            className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.section>
  );
}
