
'use client';

import { Phone } from 'lucide-react';

export default function CallsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-4">
        <h1 className="text-xl font-bold">Calls</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="rounded-full border bg-muted p-4">
          <Phone className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">No Calls Yet</h2>
        <p className="max-w-xs text-muted-foreground">
          Start a call to see your call history here. This feature is not yet
          implemented.
        </p>
      </main>
    </div>
  );
}
