import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const user = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username").notNull().unique(),
    firstname: varchar("firstname"),
    lastname: varchar("lastname"),
    role: roleEnum("role").notNull().default("user"),
    stripeCustomerId: varchar("stripe_customer_id"),
    stripeSubscriptionId: varchar("stripe_subscription_id"),
    stripeSubscriptionInterval: varchar("stripe_subscription_interval"),
    stripePriceId: varchar("stripe_price_id"),
    stripePlanId: varchar("stripe_plan_id"),
    trialUsed: boolean("trial_used").default(false),
    isDeleted: boolean("is_deleted").default(false),
    clerkUserId: varchar("clerk_user_id"),
    email: varchar("email", {}).notNull().unique(),
    createdAt: timestamp("created_at")
      .$default(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {})
      .$default(() => new Date())
      .notNull(),
  },
  (users) => ({
    usernameIndex: uniqueIndex("username_idx").on(users.username),
    emailIndex: uniqueIndex("email_idx").on(users.email),
  }),
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
