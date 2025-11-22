
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
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
  Phone,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { channels, users, useCurrentUser, setCurrentUserId, type User } from '@/lib/data';
import { Logo } from './logo';
import { useRouter } from 'next/navigation';


export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const otherUsers = users.filter((user) => user.id !== currentUser.id);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredUsers = otherUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isChatActive = pathname.startsWith('/channel') || pathname.startsWith('/dm');

  const handleLogout = () => {
    // By setting to a non-existent ID, we default to the first user on next login
    setCurrentUserId('-1'); 
    router.push('/login');
  }

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:-mt-8">
        <div className="flex items-center justify-between">
          <div className="group-data-[collapsible=icon]:opacity-0 duration-200">
            <Logo />
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
         <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isChatActive} tooltip="Chats">
                    <Link href="/channel/1">
                        <MessageSquare />
                        <span>Chats</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/calls')} tooltip="Calls">
                    <Link href="/calls">
                        <Phone />
                        <span>Calls</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {isChatActive && (
          <>
            <div className="relative group-data-[collapsible=icon]:-mx-1.5 px-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Channels</SidebarGroupLabel>
              <SidebarMenu>
                {channels.map((channel) => (
                  <SidebarMenuItem key={channel.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/channel/${channel.id}`}
                      tooltip={channel.name}
                    >
                      <Link href={`/channel/${channel.id}`}>
                        <Hash />
                        <span>{channel.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
              <SidebarMenu>
                {filteredUsers.map((user) => (
                  <SidebarMenuItem key={user.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/dm/${user.id}`}
                      tooltip={user.name}
                    >
                      <Link href={`/dm/${user.id}`} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                        {user.isActive && <div className="h-2 w-2 rounded-full bg-green-500" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {filteredUsers.length === 0 && (
                    <p className="px-2 text-sm text-muted-foreground">No users found.</p>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Settings">
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className={cn("flex items-center gap-2 p-2 transition-opacity", "group-data-[collapsible=icon]:opacity-0")}>
            <Link href={`/profile/${currentUser.id}`} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                  <span className="text-sm font-semibold">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground">{currentUser.email}</span>
              </div>
            </Link>
        </div>
      </SidebarFooter>
    </>
  );
}
