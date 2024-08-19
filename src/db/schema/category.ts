import {
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const category = pgTable(
  "category",
  {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    createdAt: timestamp("created_at")
      .$default(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {})
      .$default(() => new Date())
      .notNull(),
  },
  (categories) => ({
    uniqueIndex: uniqueIndex("title_unique").on(categories.title),
  }),
);

export type Category = typeof category.$inferSelect;
export type NewCatetory = typeof category.$inferInsert;
