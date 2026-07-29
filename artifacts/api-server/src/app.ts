import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",          // unsafe-inline needed for Vite HMR in dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  next();
});

// ── Request logging ──────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Session ──────────────────────────────────────────────────────────────────
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,   // HTTPS-only in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    },
  }),
);

// ── Static SEO files (served with correct Content-Type) ──────────────────────
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pixelnest.al/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://pixelnest.al/#about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://pixelnest.al/#services</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://pixelnest.al/#portfolio</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://pixelnest.al/#contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://pixelnest.al/privacy-policy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://pixelnest.al/terms-and-conditions</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://pixelnest.al/cookie-policy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
</urlset>`;

const ROBOTS = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/dashboard\n\nSitemap: https://pixelnest.al/sitemap.xml\n`;

app.get("/sitemap.xml", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(SITEMAP);
});

app.get("/robots.txt", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(ROBOTS);
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", router);

export default app;
