
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
import { channels, users, useCurrentUser, addUser, getUserNickname, type User as UserType } from '@/lib/data';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


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

const ChatListHeader = ({ onAddContactClick }: { onAddContactClick: () => void }) => {
    const [activeFilter, setActiveFilter] = React.useState('All');
    const filters = ['All', 'Unread', 'Direct', 'Groups'];

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
                        onClick={() => setActiveFilter(filter)}
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


const ChatList = () => {
    const pathname = usePathname();
    const currentUser = useCurrentUser();
    const [otherUsers, setOtherUsers] = React.useState<UserType[]>([]);
    const [isAddContactOpen, setIsAddContactOpen] = React.useState(false);

    React.useEffect(() => {
        const updateUsers = () => {
            if (currentUser) {
                const filteredUsers = users.filter(user => user.id !== currentUser.id);
                setOtherUsers(filteredUsers);
            }
        };

        updateUsers();

        window.addEventListener('local-storage-changed', updateUsers);
        return () => window.removeEventListener('local-storage-changed', updateUsers);
    }, [currentUser]);
    
    return (
        <div className="w-96 flex flex-col h-full bg-background/80 backdrop-blur-sm border-r border-border/20">
            <ChatListHeader onAddContactClick={() => setIsAddContactOpen(true)} />
            <SidebarContent className="p-2 space-y-4">
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1">
                        <h2 className="text-sm font-bold tracking-wider text-primary">DIRECT MESSAGES</h2>
                         <ChevronDown className="h-5 w-5 text-primary transition-transform [&[data-state=open]]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu className="pt-2">
                            {otherUsers.map((user) => {
                                const href = `/dm/${user.id}`;
                                const isActive = pathname === href;
                                const displayName = getUserNickname(user.id) || user.name;
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
                                                        Last message snippet...
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 text-xs">
                                                     <Badge className="bg-primary text-white h-5 w-5 flex items-center justify-center p-0 rounded-full border-none">3</Badge>
                                                     <p className="text-muted-foreground">10:30 AM</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </CollapsibleContent>
                </Collapsible>

                 <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1">
                       <h2 className="text-sm font-bold tracking-wider text-primary">CHANNELS</h2>
                       <ChevronDown className="h-5 w-5 text-primary transition-transform [&[data-state=open]]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu className="pt-2">
                            {channels.map((channel) => {
                                const href = `/channel/${channel.id}`;
                                const isActive = pathname === href;
                                return (
                                    <SidebarMenuItem key={`channel-${channel.id}`}>
                                        <Link href={href}>
                                            <div className={cn(
                                                "flex items-center gap-4 p-3 rounded-lg transition-colors",
                                                "bg-clip-padding bg-black/30 backdrop-filter backdrop-blur-xl bg-opacity-60 border",
                                                 "shadow-lg",
                                                isActive ? "border-primary/50" : "border-white/10 hover:bg-white/10"
                                            )}>
                                                <div className="h-12 w-12 flex items-center justify-center bg-primary/20 rounded-lg">
                                                    <p className="text-primary font-bold text-2xl">#</p>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="font-semibold truncate text-base text-white">{channel.name}</h3>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        Welcome to #{channel.name}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 text-xs">
                                                    <Badge variant="secondary" className="bg-primary/80 text-white border-0">Live</Badge>
                                                    <p className="text-muted-foreground">Yesterday</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                     </CollapsibleContent>
                </Collapsible>
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
