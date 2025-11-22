
'use client';

import * as React from 'react';
import { useCurrentUser, type User, updateUser } from '@/lib/data';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Trash2 } from 'lucide-react';

function ProfileTabContent() {
  const [isEditing, setIsEditing] = React.useState(false);
  const currentUser = useCurrentUser();
  const [user, setUser] = React.useState<User>(currentUser);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    setUser(currentUser)
  }, [currentUser])

  const handleSave = () => {
    updateUser(user.id, user);
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  const handleCancel = () => {
    setUser(currentUser); // Reset changes
    setIsEditing(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
  };

  const handleGenderChange = (value: string) => {
    setUser((prev) => ({ ...prev, gender: value as User['gender'] }));
  };
  
  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    // For this prototype, we'll just set it to an invalid URL to trigger the fallback
    setUser(prev => ({ ...prev, avatarUrl: '' }));
  }
  
  if (!user) {
    return <div>Loading profile...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          This is your personal profile. You can edit it here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Avatar className="h-24 w-24">
                <AvatarImage asChild src={user.avatarUrl} key={user.avatarUrl}>
                <Image src={user.avatarUrl} alt={user.name} width={96} height={96} />
                </AvatarImage>
                <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            {isEditing && (
                 <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handleAvatarChangeClick}>
                        <Camera className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={handleRemoveAvatar}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={user.bio}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder="Tell us a little about yourself"
            />
          </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={user.name}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={user.age}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              value={user.gender}
              disabled={!isEditing}
              onValueChange={handleGenderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AppearanceTabContent() {
    // This is a placeholder for theme switching logic
    const handleThemeChange = (theme: string) => {
        // In a real app, you would apply the theme here.
        // For now, we just log it.
        console.log(`Theme changed to: ${theme}`);
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                    Customize the look and feel of the application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">Select a theme. (This feature is not yet implemented).</p>
                </div>
                 <RadioGroup defaultValue="dark" className="grid max-w-md grid-cols-2 gap-8 pt-2" onValueChange={handleThemeChange}>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="light" className="sr-only" />
                        <span className="mb-2 text-sm font-medium">Light</span>
                        <div className="w-full h-24 rounded-lg bg-gray-200" />
                    </Label>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="dark" className="sr-only" />
                        <span className="mb-2 text-sm font-medium">Dark</span>
                        <div className="w-full h-24 rounded-lg bg-gray-800" />
                    </Label>
                </RadioGroup>
            </CardContent>
        </Card>
    )
}

function BlockedUsersTabContent() {
    // This is a placeholder for showing blocked users.
    return (
         <Card>
            <CardHeader>
                <CardTitle>Blocked Users</CardTitle>
                <CardDescription>
                    Manage users you have blocked. (This feature is not yet implemented).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                    <p>You haven&apos;t blocked any users yet.</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
  const currentUser = useCurrentUser();
  if (!currentUser) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTabContent />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTabContent />
        </TabsContent>
        <TabsContent value="blocked">
            <BlockedUsersTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
