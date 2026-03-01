import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function VideoNotePage({ params }) {
  const { videoId, id } = await params;

  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return notFound();
  }

  const noteData = await prisma.post.findUnique({
    where: { post_id: postId },
    include: {
      user: true, // Fetch user who created the post
    }
  });

  if (!noteData) {
    return notFound();
  }

  // Format date like "Mar 16, 2024"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(noteData.created_at));

  const authorName = noteData.user?.firstname
    ? `${noteData.user.firstname} ${noteData.user.lastname || ''}`.trim()
    : 'Anonymous';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href={`/video/${videoId}`}>
            <Button variant="ghost" className="flex items-center space-x-2 px-0 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium text-base">Back to Video</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <article className="space-y-8">
          {/* Article Header */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              {noteData.title}
            </h1>

            {/* Author Info Row */}
            <div className="flex items-center space-x-4 pt-4 pb-2 border-b border-border/50">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={noteData.user?.profile_pic || ""} alt={authorName} />
                <AvatarFallback className="bg-primary/5 text-primary text-lg">
                  {authorName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col sm:flex-row sm:items-center text-sm sm:space-x-2">
                <span className="font-medium text-base text-foreground">
                  {authorName}
                </span>
                <span className="hidden sm:inline-block text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Article Description / Short Notes */}
          {noteData.content && (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-xl">
                {noteData.content}
              </p>
            </div>
          )}

          {/* Document Viewer */}
          {noteData.attach_file && (
            <div className="w-full mt-10 space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Attached Document</h3>
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:h-[800px] border rounded-lg shadow-sm overflow-hidden bg-muted/30">
                <iframe
                  src={noteData.attach_file}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
