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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { channels, users, getCurrentUser, type User } from '@/lib/data';
import { Logo } from './logo';

export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = getCurrentUser();
  const otherUsers = users.filter((user) => user.id !== currentUser.id);

  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredUsers = otherUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:-mt-8">
        <div className="flex items-center justify-between">
          <div className="group-data-[collapsible=icon]:opacity-0 duration-200">
            <Logo />
          </div>
          <SidebarTrigger />
        </div>
        <div className="relative group-data-[collapsible=icon]:-mx-1.5">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
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
                  <Link href={`/dm/${user.id}`}>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {filteredUsers.length === 0 && (
                <p className="px-2 text-sm text-muted-foreground">No users found.</p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/profile'} tooltip="Profile">
              <Link href="/profile">
                <Settings />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/login">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className={cn("flex items-center gap-2 p-2 transition-opacity", "group-data-[collapsible=icon]:opacity-0")}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground">{currentUser.email}</span>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
