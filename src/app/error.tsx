'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold mb-4">500</h1>
      <p className="text-muted-foreground mb-8">Niečo sa pokazilo.</p>
      <button onClick={reset} className="underline">Skúsiť znova</button>
    </div>
  );
}
