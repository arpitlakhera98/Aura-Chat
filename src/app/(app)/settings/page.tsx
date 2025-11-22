
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCurrentUser, type User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import {
  ChevronRight,
  User as UserIcon,
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
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  href?: string;
}) => (
  <Link href={href}>
    <div className="flex items-center gap-4 px-4 py-3 bg-white/5 border-t border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-lg shadow-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
        <Icon className="h-5 w-5 text-primary" />
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
    <div className="flex h-full flex-col text-card-foreground p-4">
      <header className="p-4 space-y-4">
        <h1 className="text-3xl font-bold">Settings</h1>
         <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search Settings" 
            className="pl-10 bg-black/30 border-white/10 rounded-full focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]" 
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto space-y-6">
        <div className="px-4">
             <Link href={`/profile/${currentUser.id}`} className="flex items-center gap-4 p-4 rounded-lg bg-black/30 border border-white/10 shadow-lg hover:bg-black/40 transition-colors cursor-pointer">
              <Avatar className="h-16 w-16 border-2 border-primary">
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
                <Badge variant="outline" className="mt-1 border-primary/50 text-primary">chase your dreams</Badge>
              </div>
            </Link>
          </div>
          
          <Separator className="bg-white/10" />

          <div className="space-y-3 px-4">
            <SettingsListItem icon={UserIcon} title="Edit Profile" subtitle="Change your name, age, and bio" href="/settings/profile" />
          </div>
        </main>
    </div>
  );
}
