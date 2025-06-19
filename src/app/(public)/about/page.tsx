
"use client";

// Removed all complex imports and content for debugging

export default function AboutUsPage() {
  console.log("Simplified AboutUsPage rendering now - testing route and layout for /about.");
  return (
    <div className="container mx-auto py-12 md:py-20 px-4 space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
          Minimal About Us Page (Test)
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          If you see this, the /about route and its public layout are working at a basic level.
          The original content of this page has been temporarily replaced for debugging.
        </p>
      </section>
    </div>
  );
}
