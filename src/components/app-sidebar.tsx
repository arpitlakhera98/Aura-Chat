
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Hash,
  LogOut,
  Search,
  Settings,
  Users,
  MessageSquare,
  Circle,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { channels, users, useCurrentUser, setCurrentUserId, type User } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';


const NavRail = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        setCurrentUserId('-1'); 
        router.push('/login');
    }

    const navItems = [
        { href: '/channel/1', icon: MessageSquare, label: 'Chats', active: pathname.startsWith('/channel') || pathname.startsWith('/dm') },
        { href: '#', icon: Users, label: 'Groups' },
        { href: '#', icon: Circle, label: 'Status' },
    ];
    
    return (
        <div className="flex flex-col items-center justify-between h-full w-16 bg-card py-4">
            <div className="flex flex-col items-center gap-4">
                 {navItems.map((item) => (
                    <Link key={item.label} href={item.href} title={item.label}>
                        <Button variant="ghost" size="icon" className={cn("rounded-lg", item.active && "bg-accent text-accent-foreground")}>
                            <item.icon className="h-6 w-6" />
                        </Button>
                    </Link>
                ))}
            </div>
             <div className="flex flex-col items-center gap-4">
                 <Link href="/settings" title="Settings">
                    <Button variant="ghost" size="icon" className={cn("rounded-lg", pathname.startsWith('/settings') && "bg-accent text-accent-foreground")}>
                        <Settings className="h-6 w-6" />
                    </Button>
                </Link>
                 <Button variant="ghost" size="icon" className="rounded-lg" onClick={handleLogout}>
                    <LogOut className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}


const ChatList = () => {
    const pathname = usePathname();
    const currentUser = useCurrentUser();
    const otherUsers = users.filter((user) => user.id !== currentUser.id);

    const [searchTerm, setSearchTerm] = React.useState('');
    const filteredUsers = otherUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const allChats = [
        ...channels.map(c => ({...c, type: 'channel'})),
        ...filteredUsers.map(u => ({...u, type: 'dm'}))
    ];
    
    return (
        <div className="w-96 flex flex-col border-r h-full">
            <SidebarHeader className="p-4">
                 <h1 className="text-2xl font-bold">Chats</h1>
                 <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search or start new chat"
                        className="pl-9 bg-card"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                <SidebarMenu className="gap-0">
                    <SidebarMenuItem>
                         <button className="flex items-center gap-4 px-4 py-3 w-full hover:bg-muted">
                            <Archive className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Archived</span>
                        </button>
                    </SidebarMenuItem>
                    {allChats.map((chat) => {
                        const href = chat.type === 'channel' ? `/channel/${chat.id}` : `/dm/${chat.id}`;
                        const isActive = pathname === href;
                        return (
                             <SidebarMenuItem key={`${chat.type}-${chat.id}`}>
                                <Link href={href}>
                                     <div className={cn("flex items-start gap-3 p-4 border-b border-transparent", isActive ? "bg-muted" : "hover:bg-muted/50")}>
                                        <Avatar className="h-12 w-12 border">
                                            {chat.type === 'dm' && <AvatarImage src={(chat as User).avatarUrl} />}
                                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-semibold">{chat.name}</h3>
                                                <p className="text-xs text-muted-foreground">10:30 AM</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {chat.type === 'channel' ? `Welcome to #${chat.name}` : 'Last message snippet...'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                             </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>
        </div>
    )
}


export function AppSidebar() {
    return (
        <div className="flex h-full">
            <NavRail />
            <ChatList />
        </div>
    );
}
