
import { mockBlogPosts, mockAuthors, type BlogPost, type Author } from '@/lib/blogData';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, UserCircle, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added Avatar
import { getInitials } from '@/lib/utils'; // Added for Avatar fallback

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

  const author = mockAuthors.find(a => a.id === post.authorId);

  return (
    <div className="container mx-auto py-12 md:py-20 px-4 max-w-3xl">
      <article className="space-y-8">
        <header className="space-y-4">
          {/* Image section removed */}
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary pt-8"> {/* Added pt-8 for spacing */}
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {author && (
              <span className="flex items-center">
                 <Avatar className="mr-1.5 h-5 w-5">
                    <AvatarImage src={author.avatarUrl} alt={author.name} />
                    <AvatarFallback className="text-xs">{getInitials(author.name)}</AvatarFallback>
                 </Avatar>
                {author.name}
              </span>
            )}
            <span className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        <div
          className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {author && (
          <Card className="mt-12 bg-muted/50">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={author.avatarUrl} alt={author.name} />
                <AvatarFallback className="text-xl">{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold">About {author.name}</CardTitle>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">{author.bio}</p>
            </CardContent>
          </Card>
        )}

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
