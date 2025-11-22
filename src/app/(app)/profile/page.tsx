
'use client';

import * as React from 'react';
import { useCurrentUser } from '@/lib/data';
import { redirect, useRouter } from 'next/navigation';

export default function ProfileRedirectPage() {
  const currentUser = useCurrentUser();
  const router = useRouter();
  
  React.useEffect(() => {
    if (currentUser) {
      redirect(`/profile/${currentUser.id}`);
    } else {
        // If no user is logged in after a brief wait, redirect to login
        const timer = setTimeout(() => {
            if (!currentUser) {
                router.push('/login');
            }
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [currentUser, router]);

  return (
    <div className="flex h-full items-center justify-center">
        <p>Loading your profile...</p>
    </div>
  );
}
