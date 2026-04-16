import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { mkdirSync } from "fs";
import { join, relative } from "path";
import { AdminGuard } from "../auth/admin.guard";
import { ProductsService } from "./products.service";

const storage = diskStorage({
  destination: (req, file, cb) => {
    const slug = String((req.body?.slug ?? "draft-product")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const folder = String((req.body?.folder ?? "gallery")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const dir = join(process.cwd(), "uploads", "products", slug, folder);
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safe || "image.jpg"}`);
  },
});

@Controller()
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get("products")
  async list(@Query() query: Record<string, unknown>) {
    return { products: await this.service.listPublic(query) };
  }

  @Get("products/:slug")
  async bySlug(@Param("slug") slug: string) {
    return { product: await this.service.getPublicBySlug(slug) };
  }

  @UseGuards(AdminGuard)
  @Get("admin/products")
  async adminList() {
    return { products: await this.service.listAdmin() };
  }

  @UseGuards(AdminGuard)
  @Get("admin/products/:id")
  async adminById(@Param("id") id: string) {
    return { product: await this.service.getAdminById(id) };
  }

  @UseGuards(AdminGuard)
  @Post("admin/products")
  async create(@Body() body: Record<string, unknown>) {
    return this.service.save(body);
  }

  @UseGuards(AdminGuard)
  @Put("admin/products/:id")
  async update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.service.save(body, id);
  }

  @UseGuards(AdminGuard)
  @Patch("admin/products/:id/publish")
  async publish(@Param("id") id: string, @Body() body: { isPublished?: boolean }) {
    return this.service.setPublished(id, !!body.isPublished);
  }

  @UseGuards(AdminGuard)
  @Delete("admin/products/:id")
  async delete(@Param("id") id: string) {
    return this.service.delete(id);
  }

  @UseGuards(AdminGuard)
  @Post("admin/uploads/product-image")
  @UseInterceptors(FileInterceptor("file", { storage }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Product image file is required");
    const root = join(process.cwd(), "uploads");
    const relativePath = relative(root, file.path).replace(/\\/g, "/");
    return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}` };
  }
}
