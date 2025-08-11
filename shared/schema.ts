import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const editals = pgTable("editals", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id"),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  uploadDate: timestamp("upload_date").default(sql`CURRENT_TIMESTAMP`).notNull(),
  fileSize: integer("file_size").notNull(),
  rawText: text("raw_text"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const verticalizedContents = pgTable("verticalized_contents", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  editalId: integer("edital_id").notNull().unique(),
  structuredJson: jsonb("structured_json").notNull(),
  csvExport: text("csv_export"),
  processedAt: timestamp("processed_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  accuracyScore: real("accuracy_score"),
});

export const usersRelations = relations(users, ({ many }) => ({
  editals: many(editals),
}));

export const editalsRelations = relations(editals, ({ one }) => ({
  user: one(users, {
    fields: [editals.userId],
    references: [users.id],
  }),
  verticalizedContent: one(verticalizedContents, {
    fields: [editals.id],
    references: [verticalizedContents.editalId],
  }),
}));

export const verticalizedContentsRelations = relations(verticalizedContents, ({ one }) => ({
  edital: one(editals, {
    fields: [verticalizedContents.editalId],
    references: [editals.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEditalSchema = createInsertSchema(editals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  uploadDate: true,
});

export const insertVerticalizedContentSchema = createInsertSchema(verticalizedContents).omit({
  id: true,
  processedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEdital = z.infer<typeof insertEditalSchema>;
export type Edital = typeof editals.$inferSelect;
export type InsertVerticalizedContent = z.infer<typeof insertVerticalizedContentSchema>;
export type VerticalizedContent = typeof verticalizedContents.$inferSelect;
