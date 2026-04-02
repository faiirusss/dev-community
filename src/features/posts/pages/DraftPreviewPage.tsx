import { useParams } from '@tanstack/react-router';
import { trpc } from '~/lib/trpc';
import { Skeleton } from '~/components/ui/skeleton';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { PostPreview } from '../components/PostPreview';
import { AlertTriangle } from 'lucide-react';

export function DraftPreviewPage() {
  const { shareKey } = useParams({ from: '/_authenticated/drafts/$shareKey' });
  
  const { data: draft, isLoading, error } = trpc.drafts.getShared.useQuery(
    { shareKey },
    { retry: false }
  );
  
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }
  
  if (error || !draft) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This draft preview link is invalid or has expired.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4" />
          <span>
            This is a preview of an unpublished draft. This URL is public but secret — share at your own discretion.
          </span>
        </div>
      </div>
      
      <article className="max-w-3xl mx-auto px-4 py-8">
        <PostPreview
          title={draft.title || 'Untitled Draft'}
          content={draft.content || ''}
          coverImage={draft.coverImage || undefined}
          tags={draft.tags || []}
        />
        
        <div className="mt-8 pt-8 border-t text-sm text-muted-foreground">
          <p>Draft last updated: {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : 'Unknown'}</p>
        </div>
      </article>
    </div>
  );
}