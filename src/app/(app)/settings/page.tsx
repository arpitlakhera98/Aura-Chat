
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCurrentUser, type User, setCurrentUserId } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import {
  ChevronRight,
  User as UserIcon,
  Palette,
  LogOut,
  ShieldBan,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SettingsListItem = ({
  icon: Icon,
  title,
  subtitle,
  href,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
}) => {
    const content = (
        <div 
        onClick={onClick}
        className="flex items-center gap-4 px-4 py-3 bg-white/5 border-t border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-lg shadow-lg">
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
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
};

export default function SettingsPage() {
  const currentUser = useCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    setCurrentUserId('-1'); // Using a non-existent ID to signify logged out
    router.push('/login');
  }
  
  if (!currentUser) return (
    <div className="flex h-full items-center justify-center">
        <p>Loading settings...</p>
    </div>
  );

  return (
    <div className="flex h-full flex-col text-card-foreground p-4">
      <header className="p-4 space-y-4">
        <h1 className="text-3xl font-bold">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto space-y-6">
        <Link href={`/profile/${currentUser.id}`} className="px-4 block">
             <div className="flex items-center gap-4 p-4 rounded-lg bg-black/30 border border-white/10 shadow-lg hover:bg-black/40 transition-colors">
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
                <p className="text-sm text-muted-foreground mt-1">{currentUser.bio || 'No bio yet.'}</p>
              </div>
            </div>
          </Link>
          
          <Separator className="bg-white/10" />

          <div className="space-y-3 px-4">
            <SettingsListItem 
                icon={UserIcon} 
                title="Edit Profile" 
                subtitle="Change your name, avatar, and bio" 
                href="/settings/profile" 
            />
            <SettingsListItem 
                icon={Palette} 
                title="Appearance" 
                subtitle="Customize the look and feel" 
            />
             <SettingsListItem
              icon={ShieldBan}
              title="Blocked Users"
              subtitle="Manage who you've blocked"
              href="/settings/blocked"
            />
          </div>
        
          <Separator className="bg-white/10" />

            <div className="px-4">
                <Button onClick={handleLogout} variant="destructive" className="w-full justify-start text-left p-4 h-auto bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                    <LogOut className="h-5 w-5 mr-3" />
                    Log Out
                </Button>
            </div>
        </main>
    </div>
  );
}
