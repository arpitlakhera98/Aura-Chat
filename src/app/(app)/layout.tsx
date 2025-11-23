
'use client';

import * as React from 'react';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AppSidebar = dynamic(() => import('@/components/app-sidebar').then(mod => mod.AppSidebar), { 
    ssr: false,
    loading: () => (
        <div className="flex h-full">
            <div className="flex flex-col items-center justify-between h-full w-20 bg-card py-6 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
            </div>
            <div className="w-96 flex flex-col h-full bg-background border-r p-4 space-y-4 backdrop-blur-sm">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <div className="space-y-2 pt-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                 </div>
            </div>
        </div>
    )
});

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-screen w-screen flex bg-transparent">
      <SidebarProvider>
        <Sidebar>
            <AppSidebar />
        </Sidebar>
        <div className="flex-1 flex flex-col">
            {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
