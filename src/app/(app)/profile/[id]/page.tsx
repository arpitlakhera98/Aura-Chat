

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
import { notFound, redirect } from 'next/navigation';
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
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0">
            <div className="w-full h-24 bg-muted" />
            <div className="absolute top-12 left-6">
                <Avatar className="h-24 w-24 border-4 border-card">
                <AvatarImage asChild src={user.avatarUrl}>
                    <Image src={user.avatarUrl} alt={user.name} width={96} height={96} />
                </AvatarImage>
                <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
            </div>
             {isCurrentUser && (
                <div className="absolute top-20 right-4">
                  <Button asChild variant="outline">
                    <Link href="/settings">Edit Profile</Link>
                  </Button>
                </div>
              )}
        </CardHeader>
        <CardContent className="space-y-6 pt-16">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground pt-1">{status}</p>
            </div>
          
            <Separator />

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                <p className="text-base">{user.bio || "No bio yet."}</p>
            </div>

            <Separator />

            <div className="space-y-4">
                 <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                    <p className="text-sm font-medium">Age</p>
                    <p className="text-muted-foreground">{user.age}</p>
                    </div>
                    <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-muted-foreground">{user.gender}</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
