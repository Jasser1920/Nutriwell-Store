import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import { join } from "path";
import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";
import { ensureDatabaseReady } from "./common/database-bootstrap";

const parseAllowedOrigins = () => {
  const raw = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173,http://localhost:8080";
  const origins = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length ? origins : ["http://localhost:5173", "http://localhost:8080"];
};

async function bootstrap() {
  await ensureDatabaseReady();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const authService = app.get(AuthService);
  await authService.ensureAdmin();
  const allowedOrigins = parseAllowedOrigins();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });
  app.use(cookieParser());
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));
  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/uploads/" });
  await app.listen(Number(process.env.PORT ?? 3001));
}

void bootstrap();
