import { pgTable, text, timestamp, jsonb, serial, integer } from 'drizzle-orm/pg-core';
import type { EmailTemplate } from '#lib/types/email.js';
import { user } from './auth.schema';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const subscriptions = pgTable('subscriptions', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	polarSubscriptionId: text('polar_subscription_id').unique().notNull(),
	polarProductId: text('polar_product_id'),
	status: text('status').notNull(),
	currentPeriodEnd: timestamp('current_period_end'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const templates = pgTable('templates', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	subject: text('subject'),
	preheader: text('preheader'),
	templateData: jsonb('template_data').$type<EmailTemplate>().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type DbTemplate = typeof templates.$inferSelect;
export type NewDbTemplate = typeof templates.$inferInsert;

export * from './auth.schema';
