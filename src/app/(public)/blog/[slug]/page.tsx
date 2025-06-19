
import { mockBlogPosts, type BlogPost } from '@/lib/blogData';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, UserCircle, AlertTriangle } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto py-12 md:py-20 px-4 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, the blog post you are looking for does not exist or may have been moved.
        </p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 md:py-20 px-4 max-w-3xl">
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={post.imageHint}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <UserCircle className="mr-1.5 h-4 w-4" /> {post.author}
            </span>
            <span className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        <div
          className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
        </footer>
      </article>
    </div>
  );
}
