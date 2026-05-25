import { db } from './index';
  import { services, bookings, blockedSlots } from './schema';

  const SAMUEL_SERVICES = [
    {
      name: 'Pánsky strih',
      description: 'Strih nožnicami alebo strojčekom, umytie vlasov, styling, úprava obočia.',
      durationMinutes: 45,
      priceCents: 1800,
    },
    {
      name: 'Úprava brady',
      description: 'Úprava brady strojčekom, britvou, hot towel.',
      durationMinutes: 30,
      priceCents: 1500,
    },
    {
      name: 'Pánsky strih + úprava brady',
      description: 'Kompletná úprava: vlasy aj brada.',
      durationMinutes: 75,
      priceCents: 3000,
    },
    {
      name: 'Detský strih',
      description: 'Strih nožnicami alebo strojčekom, umytie, styling. Pre chlapcov do 12 rokov.',
      durationMinutes: 35,
      priceCents: 1800,
    },
    {
      name: 'Dlhé vlasy',
      description: 'Strih dlhých vlasov, umytie, styling.',
      durationMinutes: 75,
      priceCents: 2100,
    },
  ];

  const seed = async () => {
    console.log('🧹 Mažem existujúce business dáta...');
    await db.delete(bookings);
    await db.delete(blockedSlots);
    await db.delete(services);

    console.log('🌱 Vkladám služby...');
    await db.insert(services).values(SAMUEL_SERVICES);

    console.log('✅ Seed dokončený.');
    process.exit(0);
  };

  seed().catch((err) => {
    console.error('❌ Seed zlyhal:', err);
    process.exit(1);
  });
