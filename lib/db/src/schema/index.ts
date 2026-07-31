import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Branding"),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Project detail page fields
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  technologies: text("technologies"), // JSON string: string[]
  websiteUrl: text("website_url"),
  gallery: text("gallery"), // JSON string: string[] of image URLs
});

export const clientsTable = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
  displayOrder: integer("display_order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settingsTable = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const adminsTable = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

export const insertClientSchema = createInsertSchema(clientsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clientsTable.$inferSelect;

export type Setting = typeof settingsTable.$inferSelect;
export type Admin = typeof adminsTable.$inferSelect;
