
'use client';

import * as React from 'react';
import { summarizeConversation } from '@/lib/actions';
import type { Message } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export function SummarizeDialog({ messages }: { messages: Message[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    const result = await summarizeConversation(messages);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error,
      });
      setIsOpen(false);
    } else if (result.summary) {
      setSummary(result.summary);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      handleSummarize();
    } else {
        setSummary(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Summarize</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/60 backdrop-blur-md border-primary/30 text-white">
        <DialogHeader>
          <DialogTitle>Conversation Summary</DialogTitle>
          <DialogDescription>
            An AI-powered summary of the recent conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-muted/50" />
              <Skeleton className="h-4 w-full bg-muted/50" />
              <Skeleton className="h-4 w-3/4 bg-muted/50" />
            </div>
          )}
          {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
