const run = async () => {
  const [email, newPassword] = process.argv.slice(2);

  if (!email || !newPassword) {
    console.error('Usage: pnpm admin:reset-password <email> <new-password>');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('Heslo musi mat aspon 8 znakov.');
    process.exit(1);
  }

  console.log(`Resetujem heslo pre ${email}...`);

  try {
    const { hashPassword } = await import('better-auth/crypto');
    const { db } = await import('./index');
    const { user, account } = await import('./schema');
    const { eq } = await import('drizzle-orm');

    const [u] = await db.select().from(user).where(eq(user.email, email));
    if (!u) {
      console.error(`User ${email} not found.`);
      process.exit(1);
    }

    const hash = await hashPassword(newPassword);

    await db
      .update(account)
      .set({ password: hash, updatedAt: new Date() })
      .where(eq(account.userId, u.id));

    console.log('Heslo zmenene.');
    process.exit(0);
  } catch (err) {
    console.error('Reset zlyhal:', err);
    process.exit(1);
  }
};

run();
