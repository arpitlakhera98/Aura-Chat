
'use client';

import * as React from 'react';
import {
  getBlockedUserIds,
  unblockUser,
  getUserById,
  type User,
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Image from 'next/image';

export default function BlockedUsersPage() {
  const [blockedUsers, setBlockedUsers] = React.useState<User[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchBlockedUsers = () => {
      const blockedIds = getBlockedUserIds();
      const users = blockedIds
        .map((id) => getUserById(id))
        .filter((user): user is User => !!user);
      setBlockedUsers(users);
    };

    fetchBlockedUsers();
    
    // Listen for changes in local storage to update the list
    window.addEventListener('local-storage-changed', fetchBlockedUsers);
    return () => {
      window.removeEventListener('local-storage-changed', fetchBlockedUsers);
    };
  }, []);

  const handleUnblock = (userId: string) => {
    unblockUser(userId);
    const user = getUserById(userId);
    toast({
      title: 'User Unblocked',
      description: `${user?.name || 'The user'} has been unblocked.`,
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <Card className="w-full max-w-2xl mx-auto animate-aurora-glow border-primary/20 shadow-2xl bg-black/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Blocked Users</CardTitle>
          <CardDescription>
            Users you have blocked will appear here. You can unblock them at any
            time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blockedUsers.length > 0 ? (
            <ul className="space-y-4">
              {blockedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                       <AvatarImage asChild src={user.avatarUrl}>
                            <Image src={user.avatarUrl} alt={user.name} width={48} height={48} />
                        </AvatarImage>
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUnblock(user.id)}
                  >
                    Unblock
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                You haven&apos;t blocked anyone.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

