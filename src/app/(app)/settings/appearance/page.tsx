
'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme-provider';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'Light', value: 'light', bg: 'bg-neutral-100', text: 'text-black' },
    { name: 'Dark', value: 'dark', bg: 'bg-neutral-950', text: 'text-white' },
    { name: 'Zinc', value: 'zinc', bg: 'bg-zinc-950', text: 'text-white' },
    { name: 'Rose', value: 'rose', bg: 'bg-rose-950', text: 'text-white' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-950', text: 'text-white' },
    { name: 'Green', value: 'green', bg: 'bg-green-950', text: 'text-white' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-950', text: 'text-black' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-950', text: 'text-white' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-950', text: 'text-white' },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the app. Select a theme below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((t) => (
                <div key={t.value}>
                  <button
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      'block w-full border-2 rounded-lg p-2 transition-colors',
                      theme === t.value ? 'border-primary' : 'border-border'
                    )}
                  >
                    <div className={cn("h-24 rounded-md flex items-center justify-center relative", t.bg)}>
                       <span className={cn('font-semibold', t.text)}>{t.name}</span>
                       {theme === t.value && (
                           <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                               <Check className="h-4 w-4 text-primary-foreground" />
                           </div>
                       )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
