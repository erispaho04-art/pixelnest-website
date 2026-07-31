import { Router, type Request, type Response } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, asc, sql } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router = Router();

function parseJsonField(val: string | null | undefined): string[] | null {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

function toProjectResponse(p: typeof projectsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    category: p.category,
    imageUrl: p.imageUrl,
    displayOrder: p.displayOrder,
    createdAt: p.createdAt.toISOString(),
    challenge: p.challenge ?? null,
    solution: p.solution ?? null,
    results: p.results ?? null,
    technologies: parseJsonField(p.technologies),
    websiteUrl: p.websiteUrl ?? null,
    gallery: parseJsonField(p.gallery),
  };
}

router.get("/projects", async (_req: Request, res: Response) => {
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.displayOrder), asc(projectsTable.createdAt));
  res.json(projects.map(toProjectResponse));
});

router.post("/projects", requireAdmin, async (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    imageUrl,
    displayOrder,
    challenge,
    solution,
    results,
    technologies,
    websiteUrl,
    gallery,
  } = req.body as {
    title?: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    displayOrder?: number;
    challenge?: string;
    solution?: string;
    results?: string;
    technologies?: string[];
    websiteUrl?: string;
    gallery?: string[];
  };

  if (!title || !category || !imageUrl) {
    res.status(400).json({ error: "title, category, and imageUrl are required" });
    return;
  }

  const maxOrderResult = await db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${projectsTable.displayOrder}), -1)` })
    .from(projectsTable);
  const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

  const [created] = await db
    .insert(projectsTable)
    .values({
      title,
      description: description ?? null,
      category,
      imageUrl,
      displayOrder: displayOrder ?? nextOrder,
      challenge: challenge ?? null,
      solution: solution ?? null,
      results: results ?? null,
      technologies: technologies ? JSON.stringify(technologies) : null,
      websiteUrl: websiteUrl ?? null,
      gallery: gallery ? JSON.stringify(gallery) : null,
    })
    .returning();

  res.status(201).json(toProjectResponse(created));
});

router.patch("/projects/reorder", requireAdmin, async (req: Request, res: Response) => {
  const { ids } = req.body as { ids?: number[] };
  if (!ids || !Array.isArray(ids)) {
    res.status(400).json({ error: "ids array required" });
    return;
  }

  await Promise.all(
    ids.map((id, index) =>
      db
        .update(projectsTable)
        .set({ displayOrder: index })
        .where(eq(projectsTable.id, id))
    )
  );

  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.displayOrder), asc(projectsTable.createdAt));
  res.json(projects.map(toProjectResponse));
});

router.patch("/projects/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const {
    title,
    description,
    category,
    imageUrl,
    displayOrder,
    challenge,
    solution,
    results,
    technologies,
    websiteUrl,
    gallery,
  } = req.body as {
    title?: string;
    description?: string | null;
    category?: string;
    imageUrl?: string;
    displayOrder?: number;
    challenge?: string | null;
    solution?: string | null;
    results?: string | null;
    technologies?: string[] | null;
    websiteUrl?: string | null;
    gallery?: string[] | null;
  };

  const updates: Partial<typeof projectsTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (category !== undefined) updates.category = category;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (displayOrder !== undefined) updates.displayOrder = displayOrder;
  if (challenge !== undefined) updates.challenge = challenge;
  if (solution !== undefined) updates.solution = solution;
  if (results !== undefined) updates.results = results;
  if (technologies !== undefined)
    updates.technologies = technologies ? JSON.stringify(technologies) : null;
  if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;
  if (gallery !== undefined)
    updates.gallery = gallery ? JSON.stringify(gallery) : null;

  const [updated] = await db
    .update(projectsTable)
    .set(updates)
    .where(eq(projectsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(toProjectResponse(updated));
});

router.delete("/projects/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(204).send();
});

export default router;
