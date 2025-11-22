
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Avatar className="h-32 w-32">
              <AvatarImage asChild src={user.avatarUrl}>
                <Image src={user.avatarUrl} alt={user.name} width={128} height={128} />
              </AvatarImage>
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground pt-2">{user.bio}</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p>{user.age}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p>{user.gender}</p>
            </div>
          </div>

          {isCurrentUser && (
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/settings">Edit Profile</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
