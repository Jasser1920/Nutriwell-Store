import { BadRequestException, Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { mkdirSync } from "fs";
import { join, relative } from "path";
import { AdminGuard } from "../auth/admin.guard";
import { ContentService } from "./content.service";

const normalizeSegment = (value: unknown, fallback: string) =>
  String(value ?? fallback)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;

const storage = diskStorage({
  destination: (req, file, cb) => {
    const pageKey = normalizeSegment(req.body?.pageKey, "page");
    const section = normalizeSegment(req.body?.section, "section");
    const field = normalizeSegment(req.body?.field, "image");
    const dir = join(process.cwd(), "uploads", "content", pageKey, section, field);
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safe || "content-image.jpg"}`);
  },
});

@Controller()
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Get("content/:pageKey")
  async getPublic(@Param("pageKey") pageKey: string) {
    return this.service.get(pageKey);
  }

  @UseGuards(AdminGuard)
  @Get("admin/content/:pageKey")
  async getAdmin(@Param("pageKey") pageKey: string) {
    return this.service.get(pageKey);
  }

  @UseGuards(AdminGuard)
  @Put("admin/content/:pageKey")
  async save(@Param("pageKey") pageKey: string, @Body() body: { content?: unknown }) {
    return this.service.save(pageKey, body.content ?? {});
  }

  @UseGuards(AdminGuard)
  @Post("admin/uploads/content-image")
  @UseInterceptors(FileInterceptor("file", { storage }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Content image file is required");
    const root = join(process.cwd(), "uploads");
    const relativePath = relative(root, file.path).replace(/\\/g, "/");
    return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}` };
  }
}
