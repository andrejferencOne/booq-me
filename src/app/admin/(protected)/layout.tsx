import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { LogoutButton } from './logout-button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/admin/login');

  return (
    <div>
      <header className="border-b mb-8">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <nav className="flex gap-6 text-sm">
            <Link href="/admin" className="font-medium">Rezervácie</Link>
            <Link href="/admin/sluzby" className="font-medium">Služby</Link>
            <Link href="/admin/blokovanie" className="font-medium">Blokovanie</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
