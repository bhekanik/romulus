import { relations } from "drizzle-orm";
import {
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

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "archived",
]);

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
    status: projectStatusEnum("status").notNull().default("active"),
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
    uniqueIndex: uniqueIndex("unique_project_title").on(project.title),
  }),
);

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, { fields: [project.creatorId], references: [user.id] }),
  feedback: many(feedback),
}));

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
