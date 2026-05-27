 import { gte } from 'drizzle-orm';
  import { db } from '@/db';
  import { blockedSlots } from '@/db/schema';
  import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  } from '@/components/ui/table';
  import { formatBratislavaDateTime } from '@/lib/timezone';
  import { BlockForm } from './block-form';
  import { DeleteBlockButton } from './delete-block-button';

  export default async function AdminBlocksPage() {
    const all = await db
      .select()
      .from(blockedSlots)
      .where(gte(blockedSlots.endTime, new Date()))
      .orderBy(blockedSlots.startTime);

    return (
      <div className="container mx-auto px-4 space-y-8">
        <h1 className="text-3xl font-bold">Blokovanie termínov</h1>

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Pridať nové blokovanie</h2>
          <BlockForm />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Aktívne a budúce blokovania</h2>
          {all.length === 0 ? (
            <p className="text-muted-foreground">Žiadne blokovania.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Od</TableHead>
                  <TableHead>Do</TableHead>
                  <TableHead>Dôvod</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {all.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{formatBratislavaDateTime(b.startTime)}</TableCell>
                    <TableCell>{formatBratislavaDateTime(b.endTime)}</TableCell>
                    <TableCell>{b.reason ?? '—'}</TableCell>
                    <TableCell><DeleteBlockButton id={b.id} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    );
  }
