
'use client';

import * as React from 'react';
import { getUserById, useCurrentUser, type User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatLastSeen } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const currentUser = useCurrentUser();

  React.useEffect(() => {
    const foundUser = getUserById(resolvedParams.id);
    if (foundUser) {
      setUser(foundUser);
    } else if (resolvedParams.id) {
      // If the user is not found after checking, it's a 404
      notFound();
    }
  }, [resolvedParams.id]);

  if (!user || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const isCurrentUser = user.id === currentUser.id;
  const status = user.lastSeen === 'online'
      ? 'Online'
      : `Last seen ${formatLastSeen(user.lastSeen)}`;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="overflow-hidden bg-black/30 backdrop-blur-md border border-white/10 shadow-lg animate-aurora-glow">
        <CardHeader className="relative p-0 h-48 flex items-center justify-center">
            <Image 
              src="https://picsum.photos/seed/header-bg/1200/200" 
              alt="Profile banner"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute -bottom-16">
                <Avatar className="h-32 w-32 border-4 border-primary/50 shadow-2xl shadow-primary/20">
                  <AvatarImage asChild src={user.avatarUrl}>
                      <Image src={user.avatarUrl} alt={user.name} width={128} height={128} />
                  </AvatarImage>
                  <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
                </Avatar>
            </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-24 text-center">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-primary pt-1">{status}</p>
            </div>
          
            {isCurrentUser ? (
              <Button asChild className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105">
                <Link href="/settings">Edit Profile</Link>
              </Button>
            ) : (
                 <Button className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105">
                    Send Message
                </Button>
            )}

            <Separator className="bg-white/10" />

            <div className="space-y-2 text-left">
                <h3 className="text-sm font-semibold text-muted-foreground">ABOUT</h3>
                <p className="text-base">{user.bio || "No bio yet."}</p>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4 text-left">
                 <h3 className="text-sm font-semibold text-muted-foreground">DETAILS</h3>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <p className="font-medium">Age</p>
                      <p className="text-muted-foreground">{user.age}</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <p className="font-medium">Gender</p>
                      <p className="text-muted-foreground">{user.gender}</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
