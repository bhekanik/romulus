import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "new",
  "under_review",
  "planned",
  "in_progress",
  "done",
  "paused",
]);

export const prompts = pgTable(
  "prompts",
  {
    id: serial("id").primaryKey(),
    authorId: integer("user_id")
      .references(() => user.id, {
        onDelete: "no action",
      })
      .notNull(),
    title: varchar("title").notNull(),
    email: varchar("email"),
    category: varchar("category"),
    imageUrl: varchar("image_url"),
    description: text("description").notNull(),
    votes: integer("votes").notNull().default(0),
    role: statusEnum("status").notNull().default("new"),
    createdAt: timestamp("created_at")
      .$default(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {})
      .$default(() => new Date())
      .notNull(),
  },
  (prompts) => ({
    uniqueIndex: uniqueIndex("title_unique").on(
      prompts.title,
      prompts.authorId,
    ),
    userIdIndex: index("prompts_user_id_idx").on(prompts.authorId),
  }),
);

export const promptRelations = relations(prompts, ({ one }) => ({
  user: one(user, { fields: [prompts.authorId], references: [user.id] }),
}));

export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;
