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
import { feedback } from "./feedback";
import { organization } from "./organization";

export const projectStatusEnum = pgEnum("status", ["active", "archived"]);

export const project = pgTable(
  "project",
  {
    id: serial("id").primaryKey(),
    creatorId: integer("user_id")
      .references(() => user.id, {
        onDelete: "no action",
      })
      .notNull(),
    organizationId: integer("organization_id")
      .references(() => organization.id, {
        onDelete: "no action",
      })
      .notNull(),
    categoryId: integer("category_id").references(() => category.id, {
      onDelete: "no action",
    }),
    title: varchar("title").notNull(),
    imageUrl: varchar("image_url"),
    description: text("description").notNull(),
    createdAt: timestamp("created_at")
      .$default(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {})
      .$default(() => new Date())
      .notNull(),
  },
  (project) => ({
    uniqueIndex: uniqueIndex("title_unique").on(
      project.title,
      project.creatorId,
    ),
    userIdIndex: index("prompts_user_id_idx").on(project.creatorId),
  }),
);

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, { fields: [project.creatorId], references: [user.id] }),
  feedback: many(feedback),
}));

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
