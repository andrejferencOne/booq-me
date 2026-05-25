'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await signIn.email({ email, password });
      if (error) {
        toast.error(error.message ?? 'Prihlásenie zlyhalo');
        return;
      }
      router.refresh();
      router.push('/admin');
    });
  };

  return (
    <div className="max-w-sm mx-auto py-16 space-y-6">
      <h1 className="text-3xl font-bold text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Heslo</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Prihlasujem...' : 'Prihlásiť sa'}
        </Button>
      </form>
    </div>
  );
}
