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
import { category } from "./category";
import { project } from "./project";

export const organization = pgTable(
  "organization",
  {
    id: serial("id").primaryKey(),
    creatorId: integer("user_id")
      .references(() => user.id, {
        onDelete: "no action",
      })
      .notNull(),
    categoryId: integer("category_id").references(() => category.id, {
      onDelete: "no action",
    }),
    name: varchar("name").notNull(),
    imageUrl: varchar("image_url"),
    description: text("description").notNull(),
    createdAt: timestamp("created_at")
      .$default(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {})
      .$default(() => new Date())
      .notNull(),
  },
  (feedback) => ({
    uniqueIndex: uniqueIndex("unique_organization_name").on(feedback.name),
  }),
);

export const organizationRelations = relations(
  organization,
  ({ one, many }) => ({
    user: one(user, {
      fields: [organization.creatorId],
      references: [user.id],
    }),
    projects: many(project),
  }),
);

export type Organization = typeof organization.$inferSelect;
export type NewOrganization = typeof organization.$inferInsert;
