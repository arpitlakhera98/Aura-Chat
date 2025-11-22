
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { MessageSquare, Phone, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide main content on mobile if we are not on a chat page
  const isChat = pathname.startsWith('/channel') || pathname.startsWith('/dm');
  const showMainContent = isChat || !['/calls', '/settings'].includes(pathname);
  
  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: React.FC<any>, label: string}) => {
    const isActive = pathname === href || (href === '/chats' && (pathname.startsWith('/channel') || pathname.startsWith('/dm')));
    const effectiveHref = href === '/chats' ? '/channel/1' : href;
    
    return (
       <button
        onClick={() => router.push(effectiveHref)}
        className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium">{label}</span>
      </button>
    )
  }

  return (
    <div className="h-screen w-screen flex md:flex-row flex-col-reverse bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
         <SidebarProvider>
            <Sidebar variant="sidebar" collapsible="icon">
                <AppSidebar />
            </Sidebar>
          </SidebarProvider>
      </div>
      
      {/* Mobile-specific layout */}
      <main className={cn("flex-1 overflow-hidden", { 'hidden md:block': !showMainContent })}>
        {children}
      </main>
      
      {/* Sidebar Inset for Desktop */}
      <div className={cn("hidden md:block flex-1 overflow-hidden", { 'md:hidden': !showMainContent })}>
        <SidebarProvider>
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>

       {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex justify-around items-center border-t bg-card p-2">
        <NavItem href="/chats" icon={MessageSquare} label="Chats" />
        <NavItem href="/calls" icon={Phone} label="Calls" />
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </nav>
    </div>
  );
}
