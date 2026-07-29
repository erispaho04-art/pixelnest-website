import { Router, type Request, type Response } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router = Router();

const SETTINGS_KEYS = [
  "phone",
  "email",
  "instagram",
  "whatsapp",
  "facebook",
  "heroTitle",
  "heroSubtitle",
  "aboutText",
  "logoUrl",
] as const;

type SettingsKey = (typeof SETTINGS_KEYS)[number];

async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settingsTable);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

function toSettingsResponse(map: Record<string, string>) {
  return {
    phone: map["phone"] ?? "+355 69 581 6927",
    email: map["email"] ?? "info@pixelnest.al",
    instagram: map["instagram"] ?? "https://instagram.com/pixelnest",
    whatsapp: map["whatsapp"] ?? "https://wa.me/355695816927",
    facebook: map["facebook"] ?? "https://facebook.com/pixelnest",
    heroTitle: map["heroTitle"] ?? "Creative Digital Designer & Web Developer",
    heroSubtitle:
      map["heroSubtitle"] ??
      "I create modern websites, branding, graphic design, and digital experiences that help businesses grow.",
    aboutText:
      map["aboutText"] ??
      "I'm a creative digital designer and web developer specializing in brand identities, restaurant menus, social media design, and modern web experiences. With a passion for pixel-perfect design, I help businesses stand out.",
    logoUrl: map["logoUrl"] ?? "",
  };
}

router.get("/settings", async (_req: Request, res: Response) => {
  const map = await getAllSettings();
  res.json(toSettingsResponse(map));
});

router.patch("/settings", requireAdmin, async (req: Request, res: Response) => {
  const body = req.body as Partial<Record<SettingsKey, string>>;

  const validKeys = SETTINGS_KEYS.filter((k) => body[k] !== undefined);
  if (validKeys.length === 0) {
    res.status(400).json({ error: "No valid settings keys provided" });
    return;
  }

  await Promise.all(
    validKeys.map((key) =>
      db
        .insert(settingsTable)
        .values({ key, value: body[key]! })
        .onConflictDoUpdate({ target: settingsTable.key, set: { value: body[key]! } })
    )
  );

  const map = await getAllSettings();
  res.json(toSettingsResponse(map));
});

export default router;
