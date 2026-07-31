import { Router, type Request, type Response } from "express";
import { db, clientsTable } from "@workspace/db";
import { eq, asc, sql } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router = Router();

function toClientResponse(c: typeof clientsTable.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    website: c.website ?? null,
    displayOrder: c.displayOrder,
    featured: c.featured,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/clients", async (_req: Request, res: Response) => {
  const clients = await db
    .select()
    .from(clientsTable)
    .orderBy(asc(clientsTable.displayOrder), asc(clientsTable.createdAt));
  res.json(clients.map(toClientResponse));
});

router.post("/clients", requireAdmin, async (req: Request, res: Response) => {
  const { name, logoUrl, website, displayOrder, featured } = req.body as {
    name?: string;
    logoUrl?: string;
    website?: string;
    displayOrder?: number;
    featured?: boolean;
  };

  if (!name || !logoUrl) {
    res.status(400).json({ error: "name and logoUrl are required" });
    return;
  }

  const maxOrderResult = await db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${clientsTable.displayOrder}), -1)` })
    .from(clientsTable);
  const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

  const [created] = await db
    .insert(clientsTable)
    .values({
      name,
      logoUrl,
      website: website ?? null,
      displayOrder: displayOrder ?? nextOrder,
      featured: featured ?? false,
    })
    .returning();

  res.status(201).json(toClientResponse(created));
});

router.patch("/clients/reorder", requireAdmin, async (req: Request, res: Response) => {
  const { ids } = req.body as { ids?: number[] };
  if (!ids || !Array.isArray(ids)) {
    res.status(400).json({ error: "ids array required" });
    return;
  }

  await Promise.all(
    ids.map((id, index) =>
      db
        .update(clientsTable)
        .set({ displayOrder: index })
        .where(eq(clientsTable.id, id))
    )
  );

  const clients = await db
    .select()
    .from(clientsTable)
    .orderBy(asc(clientsTable.displayOrder), asc(clientsTable.createdAt));
  res.json(clients.map(toClientResponse));
});

router.patch("/clients/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { name, logoUrl, website, displayOrder, featured } = req.body as {
    name?: string;
    logoUrl?: string;
    website?: string | null;
    displayOrder?: number;
    featured?: boolean;
  };

  const updates: Partial<typeof clientsTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (logoUrl !== undefined) updates.logoUrl = logoUrl;
  if (website !== undefined) updates.website = website;
  if (displayOrder !== undefined) updates.displayOrder = displayOrder;
  if (featured !== undefined) updates.featured = featured;

  const [updated] = await db
    .update(clientsTable)
    .set(updates)
    .where(eq(clientsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(toClientResponse(updated));
});

router.delete("/clients/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(clientsTable).where(eq(clientsTable.id, id));
  res.status(204).send();
});

export default router;
