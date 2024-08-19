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
import { category } from "./category";
import { project } from "./project";

export const feedbackStatusEnum = pgEnum("status", [
  "new",
  "under_review",
  "planned",
  "in_progress",
  "done",
  "paused",
]);

export const feedback = pgTable(
  "feedback",
  {
    id: serial("id").primaryKey(),
    authorId: integer("user_id")
      .references(() => user.id, {
        onDelete: "no action",
      })
      .notNull(),
    projectId: integer("project_id")
      .references(() => project.id, {
        onDelete: "no action",
      })
      .notNull(),
    categoryId: integer("category_id").references(() => category.id, {
      onDelete: "no action",
    }),
    title: varchar("title").notNull(),
    email: varchar("email"),
    imageUrl: varchar("image_url"),
    description: text("description").notNull(),
    votes: integer("votes").notNull().default(0),
    role: feedbackStatusEnum("status").notNull().default("new"),
    createdAt: timestamp("created_at")
      .$default(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {})
      .$default(() => new Date())
      .notNull(),
  },
  (feedback) => ({
    uniqueIndex: uniqueIndex("title_unique").on(
      feedback.title,
      feedback.authorId,
    ),
    userIdIndex: index("prompts_user_id_idx").on(feedback.authorId),
  }),
);

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(user, { fields: [feedback.authorId], references: [user.id] }),
  project: one(project, {
    fields: [feedback.projectId],
    references: [project.id],
  }),
}));

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
