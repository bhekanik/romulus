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
import { project } from "./project";
import { feedback } from "./feedback";

export const changelog = pgTable(
  "changelog",
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
  (changelog) => ({
    uniqueIndex: uniqueIndex("unique_changelog_title").on(changelog.title),
  }),
);

export const changelogRelations = relations(changelog, ({ one, many }) => ({
  user: one(user, { fields: [changelog.authorId], references: [user.id] }),
  project: one(project, {
    fields: [changelog.projectId],
    references: [project.id],
  }),
  many: many(feedback),
}));

export type Changelog = typeof changelog.$inferSelect;
export type NewChangelog = typeof changelog.$inferInsert;
