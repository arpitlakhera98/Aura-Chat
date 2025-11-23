
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { users, setCurrentUserId, getCurrentUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('alex@example.com');
  const [password, setPassword] = React.useState('password');

  React.useEffect(() => {
    // If user is already logged in, redirect to the app
    if (getCurrentUser()) {
      router.push('/channel/1');
    }
  }, [router]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email);

    if (user) {
      setCurrentUserId(user.id);
      router.push('/channel/1');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'No user found with that email.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-md animate-aurora-glow border-primary/20 shadow-2xl bg-card/60 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/80 border-white/20 focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/80 border-white/20 focus:ring-primary/80 focus:shadow-[0_0_15px_hsl(var(--primary))]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105" type="submit">
              Log in
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline hover:text-primary/80"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
