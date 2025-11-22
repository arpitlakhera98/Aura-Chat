
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  LogOut,
  Search,
  Settings,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { channels, users, useCurrentUser, setCurrentUserId, type User as UserType } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';


const NavRail = () => {
    const pathname = usePathname();
    const router = useRouter();
    const currentUser = useCurrentUser();

    const handleLogout = () => {
        setCurrentUserId('-1'); 
        router.push('/login');
    }

    const navItems = [
        { href: '/channel/1', icon: MessageSquare, label: 'Chats', active: pathname.startsWith('/channel') || pathname.startsWith('/dm') },
        { href: '/calls', icon: Phone, label: 'Calls' , active: pathname.startsWith('/calls')},
    ];
    
    if (!currentUser) return null;

    return (
        <div className="flex flex-col items-center justify-between h-full w-20 bg-card py-6">
            <div className="flex flex-col items-center gap-2">
                <Avatar className="h-12 w-12 border-2 border-primary mb-4">
                  <AvatarImage src={currentUser.avatarUrl} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                 {navItems.map((item) => (
                    <Link key={item.label} href={item.href} title={item.label}>
                        <Button variant="ghost" size="icon" className={cn("rounded-lg h-12 w-12", item.active && "bg-accent text-primary")}>
                            <item.icon className="h-6 w-6" />
                        </Button>
                    </Link>
                ))}
            </div>
             <div className="flex flex-col items-center gap-2">
                 <Link href="/settings" title="Settings">
                    <Button variant="ghost" size="icon" className={cn("rounded-lg h-12 w-12", pathname.startsWith('/settings') && "bg-accent text-primary")}>
                        <Settings className="h-6 w-6" />
                    </Button>
                </Link>
                 <Button variant="ghost" size="icon" className="rounded-lg h-12 w-12" onClick={handleLogout}>
                    <LogOut className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}


const ChatList = () => {
    const pathname = usePathname();
    const currentUser = useCurrentUser();
    const otherUsers = users.filter((user) => user.id !== currentUser?.id);

    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredChannels = channels.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = otherUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="w-96 flex flex-col border-r border-border/50 h-full bg-background">
            <SidebarHeader className="p-4 border-b border-border/50">
                 <h1 className="text-2xl font-bold">Chats</h1>
                 <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search chats"
                        className="pl-10 bg-muted border-none rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu className="gap-1">
                    <SidebarMenuItem>
                         <h2 className="px-3 text-sm font-semibold text-muted-foreground mt-2">Channels</h2>
                    </SidebarMenuItem>
                    {filteredChannels.map((channel) => {
                        const href = `/channel/${channel.id}`;
                        const isActive = pathname === href;
                        return (
                            <SidebarMenuItem key={`channel-${channel.id}`}>
                                <Link href={href}>
                                     <div className={cn("flex items-center gap-3 p-3 rounded-lg", isActive ? "bg-accent text-white" : "hover:bg-accent/50")}>
                                        <Avatar className="h-12 w-12 flex items-center justify-center bg-muted rounded-lg">
                                            <AvatarFallback className="bg-transparent text-primary font-bold text-lg">#</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <h3 className="font-semibold truncate">{channel.name}</h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                Welcome to #{channel.name}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                             </SidebarMenuItem>
                        )
                    })}

                    <SidebarMenuItem>
                         <h2 className="px-3 text-sm font-semibold text-muted-foreground mt-4">Direct Messages</h2>
                    </SidebarMenuItem>
                     {filteredUsers.map((user) => {
                        const href = `/dm/${user.id}`;
                        const isActive = pathname === href;
                        return (
                             <SidebarMenuItem key={`dm-${user.id}`}>
                                <Link href={href}>
                                     <div className={cn("flex items-center gap-3 p-3 rounded-lg", isActive ? "bg-accent text-white" : "hover:bg-accent/50")}>
                                        <Avatar className="h-12 w-12 border-2 border-transparent relative">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                             {user.lastSeen === 'online' && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                                            )}
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <h3 className="font-semibold truncate">{user.name}</h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                Last message snippet...
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
