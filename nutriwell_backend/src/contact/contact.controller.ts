import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { mkdirSync } from "fs";
import { join, relative } from "path";
import { AdminGuard } from "../auth/admin.guard";
import { ContactService } from "./contact.service";

const storage = diskStorage({
  destination: (req, file, cb) => {
    const email = String((req.body?.email ?? "anonymous")).toLowerCase().replace(/[^a-z0-9@._-]/g, "-") || "anonymous";
    const dir = join(process.cwd(), "uploads", "contact-attachments", email);
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safe || "attachment"}`);
  },
});

@Controller()
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post("contact-reports")
  async create(@Body() body: Record<string, unknown>) {
    return this.service.create(body);
  }

  @UseGuards(AdminGuard)
  @Get("admin/contact-reports")
  async listAdmin() {
    return { reports: await this.service.listAdmin() };
  }

  @UseGuards(AdminGuard)
  @Get("admin/contact-reports/:id")
  async byId(@Param("id") id: string) {
    return { report: await this.service.getAdminById(id) };
  }

  @UseGuards(AdminGuard)
  @Patch("admin/contact-reports/:id")
  async updateStatus(@Param("id") id: string, @Body() body: { status?: string }) {
    return this.service.updateStatus(id, body.status ?? "");
  }

  @Post("uploads/contact-attachment")
  @UseInterceptors(FileInterceptor("file", { storage }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Attachment file is required");
    const root = join(process.cwd(), "uploads");
    const relativePath = relative(root, file.path).replace(/\\/g, "/");
    return {
      path: `/uploads/${relativePath}`,
      url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}`,
    };
  }

  @UseGuards(AdminGuard)
  @Get("admin/contact-reports/attachment")
  async attachment(@Query("path") path: string) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}${normalized}` };
  }
}
