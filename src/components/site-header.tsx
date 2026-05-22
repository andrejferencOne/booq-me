import Link from 'next/link';

export const SiteHeader = () => (
  <header className="border-b">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/" className="text-xl font-bold">
        Samuel Agošton
      </Link>
      <nav className="flex gap-6 text-sm">
        <Link href="/" className="hover:underline">Domov</Link>
        <Link href="/rezervacia" className="hover:underline">Rezervácia</Link>
      </nav>
    </div>
  </header>
);
