import { relations } from 'drizzle-orm';
  import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    index,
  } from 'drizzle-orm/pg-core';

  export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
  
  export const services = pgTable('services', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    description: text('description'),
    durationMinutes: integer('duration_minutes').notNull(),
    priceCents: integer('price_cents').notNull(),
    status: statusEnum('status').notNull().default('ACTIVE'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  });

  export const bookings = pgTable(
    'bookings',
    {
      id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
      serviceId: text('service_id').notNull().references(() => services.id),
      startTime: timestamp('start_time', { withTimezone: true }).notNull(),
      endTime: timestamp('end_time', { withTimezone: true }).notNull(),
      customerName: text('customer_name').notNull(),
      customerEmail: text('customer_email').notNull(),
      customerPhone: text('customer_phone').notNull(),
      note: text('note'),
      canceled: boolean('canceled').notNull().default(false),
      createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
      index('idx_bookings_start_time').on(table.startTime),
      index('idx_bookings_canceled_start').on(table.canceled, table.startTime),
    ],
  );

  export const blockedSlots = pgTable(
    'blocked_slots',
    {
      id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
      startTime: timestamp('start_time', { withTimezone: true }).notNull(),
      endTime: timestamp('end_time', { withTimezone: true }).notNull(),
      reason: text('reason'),
      createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
      index('idx_blocked_slots_range').on(table.startTime, table.endTime),
    ],
  );

  export const bookingsRelations = relations(bookings, ({ one }) => ({
    service: one(services, {
      fields: [bookings.serviceId],
      references: [services.id],
    }),
  }));

  export type Service = typeof services.$inferSelect;
  export type NewService = typeof services.$inferInsert;
  export type Booking = typeof bookings.$inferSelect;
  export type NewBooking = typeof bookings.$inferInsert;
  export type BlockedSlot = typeof blockedSlots.$inferSelect;
  export type NewBlockedSlot = typeof blockedSlots.$inferInsert;

  // ───── Better Auth tabuľky ─────
  export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  });

  export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  });

  export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  });

  export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  });

  export type User = typeof user.$inferSelect;
  export type Session = typeof session.$inferSelect;
