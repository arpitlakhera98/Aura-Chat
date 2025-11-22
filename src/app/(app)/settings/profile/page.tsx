
'use client';

import * as React from 'react';
import { useCurrentUser, updateUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

const DUMMY_AVATAR_URL = 'https://picsum.photos/seed/placeholder/96/96';

export default function EditProfilePage() {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState<number | string>('');
  const [bio, setBio] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [avatarPreview, setAvatarPreview] = React.useState('');

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAge(currentUser.age);
      setBio(currentUser.bio || '');
      setAvatarUrl(currentUser.avatarUrl);
      setAvatarPreview(currentUser.avatarUrl);
    }
  }, [currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatarUrl(result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setAvatarPreview(DUMMY_AVATAR_URL);
    setAvatarUrl(DUMMY_AVATAR_URL);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUser(currentUser.id, {
      name,
      age: Number(age),
      bio,
      avatarUrl,
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
            <div className="space-y-4 flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
              <div className="flex flex-col items-center gap-3">
                 <Avatar className="h-24 w-24 border-4 border-primary/50">
                    <AvatarImage asChild src={avatarPreview}>
                        <Image src={avatarPreview} alt="Avatar Preview" width={96} height={96} />
                    </AvatarImage>
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change</Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleRemovePicture}>Remove</Button>
                </div>
              </div>
              <div className="w-full space-y-4">
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
              </div>
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

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))]">Save Changes</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
