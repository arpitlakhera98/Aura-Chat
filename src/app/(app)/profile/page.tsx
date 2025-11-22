
'use client';

import * as React from 'react';
import { useCurrentUser, users, type User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default function ProfileRedirectPage() {
  const currentUser = useCurrentUser();
  
  React.useEffect(() => {
    if (currentUser) {
      redirect(`/profile/${currentUser.id}`);
    }
  }, [currentUser]);

  return (
    <div className="flex h-full items-center justify-center">
        <p>Loading your profile...</p>
    </div>
  );
}
