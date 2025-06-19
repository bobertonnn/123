
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockBlogPosts, type BlogPost } from '@/lib/blogData'; // Assuming blogData.ts is in src/lib
import { Rss, ArrowRight, UserCircle, CalendarDays } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <section className="text-center mb-16">
        <Rss className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
          Our Blog
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, news, and updates from the DocuSigner team. Stay informed about the latest in document management and e-signature solutions.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBlogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            <div className="relative w-full h-56">
              <Image
                src={post.imageUrl}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={post.imageHint}
              />
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-headline hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground pt-1">
                <div className="flex items-center space-x-3">
                    <span className="flex items-center"><UserCircle className="mr-1 h-3.5 w-3.5"/>{post.author}</span>
                    <span className="flex items-center"><CalendarDays className="mr-1 h-3.5 w-3.5"/>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className="p-0 text-primary hover:underline">
                <Link href={`/blog/${post.slug}`}>
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
