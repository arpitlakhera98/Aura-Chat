
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
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { channels, users, useCurrentUser, setCurrentUserId, type User as UserType } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';


const NavRail = () => {
    const pathname = usePathname();
    const router = useRouter();
    const currentUser = useCurrentUser();

    const handleLogout = () => {
        setCurrentUserId('-1'); 
        window.dispatchEvent(new CustomEvent('local-storage-changed'));
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
                <Link href={`/profile/${currentUser.id}`}>
                    <Avatar className="h-12 w-12 border-2 border-primary mb-4 transition-all hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary))]">
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                </Link>
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
    const [isChannelsOpen, setIsChannelsOpen] = React.useState(true);

    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredChannels = channels.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = otherUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="w-96 flex flex-col border-r border-border/50 h-full bg-background">
            <SidebarHeader className="p-4 border-b border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Chats</h1>
                    <Button variant="ghost" size="icon">
                        <PlusCircle className="h-6 w-6 text-primary" />
                    </Button>
                </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search chats..."
                        className="pl-10 bg-input border-none rounded-full focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                <SidebarMenu className="gap-0">
                   <Collapsible open={isChannelsOpen} onOpenChange={setIsChannelsOpen} className="p-2">
                        <CollapsibleTrigger className="w-full">
                           <div className="flex items-center justify-between w-full px-2 py-2">
                                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">CHANNELS</h2>
                                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isChannelsOpen && "rotate-180")} />
                           </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1">
                            {filteredChannels.map((channel) => {
                                const href = `/channel/${channel.id}`;
                                const isActive = pathname === href;
                                return (
                                    <SidebarMenuItem key={`channel-${channel.id}`}>
                                        <Link href={href}>
                                            <div className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", isActive ? "bg-accent text-white" : "hover:bg-accent/50")}>
                                                <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-lg">
                                                    <p className="text-primary font-bold text-lg">#</p>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="font-semibold truncate">{channel.name}</h3>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        Welcome to #{channel.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </CollapsibleContent>
                    </Collapsible>
                    
                    <div className="p-2">
                        <h2 className="px-2 py-2 text-sm font-semibold tracking-wider text-muted-foreground">DIRECT MESSAGES</h2>
                         <div className="space-y-1">
                            {filteredUsers.map((user) => {
                                const href = `/dm/${user.id}`;
                                const isActive = pathname === href;
                                return (
                                    <SidebarMenuItem key={`dm-${user.id}`}>
                                        <Link href={href}>
                                            <div className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", isActive ? "bg-accent text-white" : "hover:bg-accent/50")}>
                                                <Avatar className="h-10 w-10 border-2 border-transparent relative">
                                                    <AvatarImage src={user.avatarUrl} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    {user.lastSeen === 'online' && (
                                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                                    )}
                                                </Avatar>
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="font-semibold truncate">{user.name}</h3>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        Last message snippet...
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </div>
                    </div>
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
