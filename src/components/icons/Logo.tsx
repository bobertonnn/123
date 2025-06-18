
import type { SVGProps } from 'react';

// New Line Art Bird Icon with Gradient Stroke
export const GradientBirdIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100" // Standard viewBox for easier coordinate management
    aria-hidden="true" // Decorative icon
    {...props}
  >
    <defs>
      <linearGradient id="logoBirdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
      </linearGradient>
    </defs>
    {/* 
      Path for the line art bird:
      1. M20 35 Q50 10 80 35: Upper curve for wings/back.
      2. M20 35 L50 65 L80 35: Connects wingtips through a V-shape (lower part of wings/breast).
         (Re-using M20 35 is implicit, but L50 65 L80 35 continues from the previous M's endpoint effectively)
         Let's make it more explicit: M20 35 L50 65 L80 35 (Breast and lower wings) - this would be a separate path.
         To keep it one path with gradient:
         The original path description: M20 35 Q50 10 80 35 M20 35 L50 65 L80 35 M50 65 L50 85 M40 80 L60 80
         This creates separate segments. The gradient might restart on each M.

         A new path focusing on a stylized bird shape:
         - Upper arc for wings: M15 45 C 30 20, 70 20, 85 45
         - Lower body/tail swoop: C 75 65, 60 75, 50 80 C 40 75, 25 65, 15 45 Z (closing it for a line feel is tricky)
         
         Let's use the segmented path from thought process as it is clear.
    */}
    <path
      d="M20 35 Q50 15 80 35 L50 75 Z M50 75 L45 90 M50 75 L55 90" // Simplified: Upper wings (arc), body (triangle), tail (two small lines)
      stroke="url(#logoBirdGradient)"
      strokeWidth="6" // Increased stroke width for better gradient visibility
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center space-x-2" aria-label="DocuSigner Logo">
      <GradientBirdIcon className="h-8 w-8" {...props} /> {/* Removed text-primary as stroke has gradient */}
      <span className="font-headline text-2xl font-semibold text-foreground">
        DocuSigner
      </span>
    </div>
  );
}
