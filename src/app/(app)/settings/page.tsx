
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCurrentUser, type User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  ChevronRight,
  User as UserIcon,
  Lock,
  MessageSquare,
  Bell,
  Star,
  Link2,
  List,
  Megaphone,
  QrCode,
  Palette,
  Slash,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SettingsListItem = ({
  icon: Icon,
  title,
  subtitle,
  href = '#',
  isPlaceholder,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  href?: string;
  isPlaceholder?: boolean;
}) => (
  <Link href={isPlaceholder ? '#' : href}>
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  </Link>
);

export default function SettingsPage() {
  const currentUser = useCurrentUser();

  if (!currentUser) return null;

  return (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <header className="p-4 space-y-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search" className="pl-10" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          <div className="px-4">
             <Link href={`/profile/${currentUser.id}`} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer -m-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage asChild src={currentUser.avatarUrl}>
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    width={64}
                    height={64}
                  />
                </AvatarImage>
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xl font-semibold">{currentUser.name}</p>
                <Badge variant="outline" className="mt-1">chase your dreams</Badge>
              </div>
              <QrCode className="h-7 w-7 text-muted-foreground" />
            </Link>
          </div>

          <Link href="/settings/avatar" className="block px-4">
            <div className="flex items-center gap-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer rounded-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                    <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="font-medium text-primary">Avatar</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>

          <Separator />
          
          <div className="space-y-1">
            <SettingsListItem icon={List} title="Lists" isPlaceholder />
            <SettingsListItem icon={Megaphone} title="Broadcast messages" isPlaceholder />
            <SettingsListItem icon={Star} title="Starred" isPlaceholder />
            <SettingsListItem icon={Link2} title="Linked devices" isPlaceholder />
          </div>

          <Separator />

          <div className="space-y-1">
            <SettingsListItem icon={UserIcon} title="Account" subtitle="Security notifications, change number" href="/settings/profile" />
            <SettingsListItem icon={Lock} title="Privacy" subtitle="Block contacts, disappearing messages" href="/settings/privacy" />
            <SettingsListItem icon={MessageSquare} title="Chats" subtitle="Theme, wallpapers, chat history" href="/settings/appearance" />
            <SettingsListItem icon={Bell} title="Notifications" subtitle="Message, group & call tones" isPlaceholder />
            <SettingsListItem icon={Slash} title="Blocked Users" subtitle="Manage blocked users" href="/settings/blocked" />
          </div>

        </div>
      </main>
    </div>
  );
}
