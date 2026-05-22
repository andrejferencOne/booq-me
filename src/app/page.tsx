 import Link from 'next/link';
  import { Scissors, Sparkles, Baby } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
  import { formatPriceFromCents, formatDuration } from '@/lib/format';

  const services = [
    {
      icon: Scissors,
      name: 'Pánsky strih',
      durationMinutes: 45,
      priceCents: 1800,
      description: 'Strih nožnicami alebo strojčekom, umytie vlasov, styling, úprava obočia.',
    },
    {
      icon: Sparkles,
      name: 'Úprava brady',
      durationMinutes: 30,
      priceCents: 1500,
      description: 'Úprava brady strojčekom, britvou, hot towel.',
    },
    {
      icon: Sparkles,
      name: 'Pánsky strih + úprava brady',
      durationMinutes: 75,
      priceCents: 3000,
      description: 'Kompletná úprava: vlasy aj brada.',
    },
    {
      icon: Baby,
      name: 'Detský strih',
      durationMinutes: 35,
      priceCents: 1800,
      description: 'Strih nožnicami alebo strojčekom, umytie, styling. Pre chlapcov do 12 rokov.',
    },
    {
      icon: Scissors,
      name: 'Dlhé vlasy',
      durationMinutes: 75,
      priceCents: 2100,
      description: 'Strih dlhých vlasov, umytie, styling.',
    },
  ];

  export default function Home() {
    return (
      <>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Pánsky barber v centre Bratislavy
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Strihy, brady, detské strihy. Rezervácia online za 60 sekúnd.
            </p>
            <Button asChild size="lg">
              <Link href="/rezervacia">Rezervovať termín</Link>
            </Button>
          </div>
        </section>
  
        {/* Služby */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8">Služby</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <CardTitle>{service.name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatPriceFromCents(service.priceCents)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDuration(service.durationMinutes)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Kontakt */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8">Kontakt</h2>
          <address className="not-italic text-muted-foreground space-y-2">
            <p>Hlavná 12, 811 01 Bratislava</p>
            <p>Tel: <a href="tel:+421900000000" className="hover:underline">+421 900 000 000</a></p>
            <p>Po–Pi: 9:00–19:00</p>
            <p>So: 9:00–14:00</p>
          </address>
        </section>
      </>
    );
  }
