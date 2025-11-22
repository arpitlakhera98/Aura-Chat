
'use client';

import * as React from 'react';
import { useCurrentUser, updateUser } from '@/lib/data';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState<number | string>('');
  const [bio, setBio] = React.useState('');

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAge(currentUser.age);
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUser(currentUser.id, {
      name,
      age: Number(age),
      bio,
    });

    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
    router.push(`/profile/${currentUser.id}`);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <Card className="w-full max-w-2xl mx-auto animate-aurora-glow border-primary/20 shadow-2xl bg-black/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>
            Make changes to your profile here. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveChanges}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border-white/10 focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-black/20 border-white/10 focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself"
                className="bg-black/20 border-white/10 focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]"
              />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))]">Save Changes</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
