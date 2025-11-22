
'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-screen w-screen flex bg-background">
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
