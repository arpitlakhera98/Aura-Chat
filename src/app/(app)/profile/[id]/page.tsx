
'use client';

import * as React from 'react';
import {
  getUserById,
  useCurrentUser,
  type User,
  getUserNickname,
  setUserNickname,
  isCurrentUserBlockedBy,
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatLastSeen } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Edit2, ShieldBan } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const currentUser = useCurrentUser();
  const [isCurrentUser, setIsCurrentUser] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [nicknameInput, setNicknameInput] = React.useState('');
  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();


  React.useEffect(() => {
    const foundUser = getUserById(resolvedParams.id);
    if (foundUser) {
      setUser(foundUser);
      const isMe = currentUser?.id === foundUser.id;
      setIsCurrentUser(isMe);

      if (isMe) {
        setDisplayName(foundUser.name);
      } else {
        const nickname = getUserNickname(foundUser.id);
        setDisplayName(nickname || foundUser.name);
        setNicknameInput(nickname || '');
      }

      // Check if the current user is blocked by the profile owner
      if (currentUser?.id) {
          setIsBlocked(isCurrentUserBlockedBy(foundUser.id));
      }

    } else if (resolvedParams.id) {
      notFound();
    }
  }, [resolvedParams.id, currentUser]);

  const handleNicknameSave = () => {
    if (!user) return;
    setUserNickname(user.id, nicknameInput);
    setDisplayName(nicknameInput || user.name);
    setIsNicknameDialogOpen(false);
    toast({
        title: "Nickname Updated",
        description: `The nickname for ${user.name} has been set.`,
    });
  };

  const openNicknameDialog = () => {
    if (user) {
        const nickname = getUserNickname(user.id);
        setNicknameInput(nickname || '');
        setIsNicknameDialogOpen(true);
    }
  }

  if (isBlocked) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Card className="overflow-hidden bg-card/60 backdrop-blur-md border border-white/10 shadow-lg animate-aurora-glow text-center">
                <CardHeader>
                    <ShieldBan className="mx-auto h-16 w-16 text-destructive" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">You are Blocked</h2>
                    <p className="text-muted-foreground mt-2">
                        You cannot view this profile because the user has blocked you.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!user || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const status =
    user.lastSeen === 'online'
      ? 'Online'
      : `Last seen ${formatLastSeen(user.lastSeen)}`;

  const handleSendMessage = () => {
    router.push(`/dm/${user.id}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="overflow-hidden bg-card/60 backdrop-blur-md border border-white/10 shadow-lg animate-aurora-glow">
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
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={128}
                  height={128}
                />
              </AvatarImage>
              <AvatarFallback className="text-4xl">
                {displayName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-24 text-center">
            <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-3xl font-bold">{displayName}</h2>
                    {!isCurrentUser && (
                        <>
                            <Button variant="ghost" size="icon" onClick={openNicknameDialog} className="h-8 w-8">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                             <AlertDialog open={isNicknameDialogOpen} onOpenChange={setIsNicknameDialogOpen}>
                                <AlertDialogContent className="bg-background/60 backdrop-blur-md border-primary/30 text-white">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Edit Nickname</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Set a local nickname for {user.name}. This will only be visible to you.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="py-4">
                                        <Label htmlFor="nickname">Nickname</Label>
                                        <Input 
                                            id="nickname"
                                            value={nicknameInput}
                                            onChange={(e) => setNicknameInput(e.target.value)}
                                            placeholder="Enter nickname"
                                            className="bg-input/80 border-white/20"
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleNicknameSave}>Save</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>

                {isCurrentUser && (
                    <p className="text-muted-foreground">{user.email}</p>
                )}
                 <p className="text-sm text-primary pt-1">{status}</p>
            </div>

          {isCurrentUser ? (
            <Button
              asChild
              className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105"
            >
              <Link href="/settings/profile">Edit Profile</Link>
            </Button>
          ) : (
            <Button onClick={handleSendMessage} className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105">
              Send Message
            </Button>
          )}

          <Separator className="bg-white/10" />

          <div className="space-y-2 text-left">
            <h3 className="text-sm font-semibold text-muted-foreground">
              ABOUT
            </h3>
            <p className="text-base">{user.bio || 'No bio yet.'}</p>
          </div>
            
          {isCurrentUser && (
            <>
                <Separator className="bg-white/10" />
                <div className="space-y-4 text-left">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                    DETAILS
                    </h3>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
