import { MessageSquare } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <MessageSquare className="h-8 w-8 text-accent" />
      <h1 className="text-2xl font-bold text-foreground">Aura Chat</h1>
    </div>
  );
}
