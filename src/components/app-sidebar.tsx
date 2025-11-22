
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
import {
  Search,
  Settings,
  MessageSquare,
  Phone,
  PlusCircle,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChannels, getChannels, users, useCurrentUser, addUser, getUserNickname, useMessages, type User as UserType, type Message, getUnreadMessageCount } from '@/lib/data';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format, isToday, isYesterday } from 'date-fns';


const NavRail = () => {
    const pathname = usePathname();
    const currentUser = useCurrentUser();

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
            </div>
        </div>
    )
}

function AddContactDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const handleAddContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all fields.',
            });
            return;
        }

        addUser({
            name,
            email,
            age: 25, 
            gender: 'Prefer not to say', 
        });

        toast({
            title: 'Contact Added!',
            description: `${name} has been added to your contacts.`,
        });

        setName('');
        setEmail('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>
                        Enter the details of the person you want to add.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddContact}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="Alex" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" placeholder="alex@example.com" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                             <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Contact</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type ChatFilter = 'All' | 'Unread' | 'Direct' | 'Groups';

const ChatListHeader = ({ activeFilter, onFilterChange, onAddContactClick }: { activeFilter: ChatFilter, onFilterChange: (filter: ChatFilter) => void, onAddContactClick: () => void }) => {
    const filters: ChatFilter[] = ['All', 'Unread', 'Direct', 'Groups'];

    return (
        <SidebarHeader className="p-4 border-b border-border/20 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-primary">CHATS</h1>
                <Button variant="ghost" size="icon" className="bg-primary/20 text-primary rounded-full h-10 w-10 hover:bg-primary/30" onClick={onAddContactClick}>
                    <PlusCircle className="h-6 w-6" />
                </Button>
            </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-10 bg-black/30 border-white/10 rounded-full focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]" />
            </div>
            <div className="flex items-center gap-2">
                {filters.map(filter => (
                    <Button
                        key={filter}
                        variant={activeFilter === filter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFilterChange(filter)}
                        className={cn(
                            'rounded-full px-4 py-1 h-auto text-sm font-semibold border-border/30',
                            activeFilter === filter
                                ? 'bg-primary text-primary-foreground border-transparent'
                                : 'bg-transparent text-muted-foreground hover:bg-accent/50 hover:text-white'
                        )}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </SidebarHeader>
    );
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
        return format(date, 'p'); // e.g., 4:30 PM
    }
    if (isYesterday(date)) {
        return 'Yesterday';
    }
    return format(date, 'M/d/yy'); // e.g., 7/25/24
};

const ChatList = () => {
    const pathname = usePathname();
    const currentUser = useCurrentUser();
    const allMessages = useMessages();
    const channels = useChannels();
    const [isAddContactOpen, setIsAddContactOpen] = React.useState(false);
    const [activeFilter, setActiveFilter] = React.useState<ChatFilter>('All');
    
    // This state will trigger re-renders when local storage changes for unread counts
    const [_, setForceUpdate] = React.useState(0);
    React.useEffect(() => {
        const handleStorageChange = () => setForceUpdate(c => c + 1);
        window.addEventListener('local-storage-changed', handleStorageChange);
        return () => window.removeEventListener('local-storage-changed', handleStorageChange);
    }, []);

    const sortedDMs = React.useMemo(() => {
        if (!currentUser) return [];

        const otherUsers = users.filter(user => user.id !== currentUser.id);

        const lastMessages: Record<string, Message> = {};

        allMessages.forEach(msg => {
            if (msg.dmId) {
                const isRelevant = msg.dmId.includes(currentUser.id);
                if (isRelevant) {
                    const otherUserId = msg.dmId.replace(currentUser.id, '').replace('-', '');
                    if (!lastMessages[otherUserId] || new Date(msg.timestamp) > new Date(lastMessages[otherUserId].timestamp)) {
                        lastMessages[otherUserId] = msg;
                    }
                }
            }
        });

        return otherUsers
            .map(user => ({
                user,
                lastMessage: lastMessages[user.id] || null
            }))
            .sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
            });

    }, [currentUser, allMessages]);

    const sortedChannels = React.useMemo(() => {
        if (!currentUser) return [];
        const lastMessages: Record<string, Message> = {};
        allMessages.forEach(msg => {
            if (msg.channelId) {
                if (!lastMessages[msg.channelId] || new Date(msg.timestamp) > new Date(lastMessages[msg.channelId].timestamp)) {
                    lastMessages[msg.channelId] = msg;
                }
            }
        });

        return channels
            .filter(channel => channel.memberIds.includes(currentUser.id))
            .map(channel => ({
                channel,
                lastMessage: lastMessages[channel.id] || null
            }))
            .sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
            });
    }, [allMessages, channels, currentUser]);

    const filteredDMs = React.useMemo(() => {
        if (activeFilter === 'All' || activeFilter === 'Direct') return sortedDMs;
        if (activeFilter === 'Groups') return [];
        if (activeFilter === 'Unread') {
            return sortedDMs.filter(({ user }) => {
                if (!currentUser) return false;
                const dmId = [currentUser.id, user.id].sort().join('-');
                return getUnreadMessageCount(dmId, allMessages) > 0;
            });
        }
        return sortedDMs;
    }, [activeFilter, sortedDMs, allMessages, currentUser]);

    const filteredChannels = React.useMemo(() => {
        if (activeFilter === 'All' || activeFilter === 'Groups') return sortedChannels;
        if (activeFilter === 'Direct') return [];
        if (activeFilter === 'Unread') {
            return sortedChannels.filter(({ channel }) => getUnreadMessageCount(channel.id, allMessages) > 0);
        }
        return sortedChannels;
    }, [activeFilter, sortedChannels, allMessages]);
    
    return (
        <div className="w-96 flex flex-col h-full bg-background/80 backdrop-blur-sm border-r border-border/20">
            <ChatListHeader 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                onAddContactClick={() => setIsAddContactOpen(true)} 
            />
            <SidebarContent className="p-2 space-y-4">
                {activeFilter !== 'Groups' && (
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1">
                            <h2 className="text-sm font-bold tracking-wider text-primary">DIRECT MESSAGES</h2>
                            <ChevronDown className="h-5 w-5 text-primary transition-transform [&[data-state=open]]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenu className="pt-2">
                                {filteredDMs.map(({ user, lastMessage }) => {
                                    if (!currentUser) return null;
                                    const href = `/dm/${user.id}`;
                                    const isActive = pathname === href;
                                    const displayName = getUserNickname(user.id) || user.name;
                                    const dmId = [currentUser.id, user.id].sort().join('-');
                                    const unreadCount = getUnreadMessageCount(dmId, allMessages);

                                    return (
                                        <SidebarMenuItem key={`dm-${user.id}`}>
                                            <Link href={href}>
                                                <div className={cn(
                                                    "relative flex items-center gap-4 p-3 rounded-lg transition-colors group",
                                                    "bg-clip-padding bg-black/30 backdrop-filter backdrop-blur-xl bg-opacity-60 border border-white/10",
                                                    "shadow-lg",
                                                    isActive ? "border-t-primary/80" : "border-t-white/10 hover:bg-white/10"
                                                )}>
                                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                                                    <Avatar className="h-12 w-12 border-2 border-transparent">
                                                        <AvatarImage src={user.avatarUrl} />
                                                        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 overflow-hidden">
                                                        <h3 className="font-semibold truncate text-base text-white">{displayName}</h3>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {lastMessage ? lastMessage.content : 'No messages yet'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1 text-xs self-start pt-1">
                                                        {unreadCount > 0 && (
                                                            <Badge className="bg-primary text-white h-5 w-5 flex items-center justify-center p-0 rounded-full border-none">{unreadCount}</Badge>
                                                        )}
                                                        <p className={cn("text-muted-foreground", unreadCount > 0 && "mt-auto")}>{lastMessage ? formatTimestamp(lastMessage.timestamp) : ''}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                 {activeFilter !== 'Direct' && (
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1">
                        <h2 className="text-sm font-bold tracking-wider text-primary">CHANNELS</h2>
                        <ChevronDown className="h-5 w-5 text-primary transition-transform [&[data-state=open]]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenu className="pt-2">
                                {filteredChannels.map(({ channel, lastMessage }) => {
                                    const href = `/channel/${channel.id}`;
                                    const isActive = pathname === href;
                                    const unreadCount = getUnreadMessageCount(channel.id, allMessages);

                                    return (
                                        <SidebarMenuItem key={`channel-${channel.id}`}>
                                            <Link href={href}>
                                                <div className={cn(
                                                    "flex items-center gap-4 p-3 rounded-lg transition-colors",
                                                    "bg-clip-padding bg-black/30 backdrop-filter backdrop-blur-xl bg-opacity-60 border",
                                                    "shadow-lg",
                                                    isActive ? "border-primary/50" : "border-white/10 hover:bg-white/10"
                                                )}>
                                                    <Avatar className="h-12 w-12 flex items-center justify-center bg-muted rounded-lg">
                                                        <AvatarImage src={channel.avatarUrl} />
                                                        <AvatarFallback className="text-primary font-bold text-2xl">#</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 overflow-hidden">
                                                        <h3 className="font-semibold truncate text-base text-white">{channel.name}</h3>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {lastMessage ? lastMessage.content : `Welcome to #${channel.name}`}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1 text-xs self-start pt-1">
                                                        {unreadCount > 0 ? (
                                                            <Badge className="bg-primary text-white h-5 w-5 flex items-center justify-center p-0 rounded-full border-none">{unreadCount}</Badge>
                                                        ) : (
                                                            channel.memberIds.length < 5 && <Badge variant="secondary" className="bg-green-500/80 text-white border-0">Join</Badge>
                                                        )}
                                                        <p className={cn("text-muted-foreground", unreadCount > 0 && "mt-auto")}>{lastMessage ? formatTimestamp(lastMessage.timestamp) : ''}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </CollapsibleContent>
                    </Collapsible>
                 )}
            </SidebarContent>
            <AddContactDialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen} />
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
