import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { mkdirSync } from "fs";
import { join, relative } from "path";
import { AdminGuard } from "../auth/admin.guard";
import { RecipesService } from "./recipes.service";

const storage = diskStorage({
  destination: (req, file, cb) => {
    const slug = String((req.body?.slug ?? "draft-recipe")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const dir = join(process.cwd(), "uploads", "recipes", slug);
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safe || "recipe.jpg"}`);
  },
});

@Controller()
export class RecipesController {
  constructor(private readonly service: RecipesService) {}

  @Get("recipes")
  async list(@Query() query: Record<string, unknown>) {
    return { recipes: await this.service.listPublic(query) };
  }

  @Get("recipes/:slug")
  async bySlug(@Param("slug") slug: string) {
    return { recipe: await this.service.getPublicBySlug(slug) };
  }

  @UseGuards(AdminGuard)
  @Get("admin/recipes")
  async adminList() {
    return { recipes: await this.service.listAdmin() };
  }

  @UseGuards(AdminGuard)
  @Get("admin/recipes/:id")
  async adminById(@Param("id") id: string) {
    return { recipe: await this.service.getAdminById(id) };
  }

  @UseGuards(AdminGuard)
  @Post("admin/recipes")
  async create(@Body() body: Record<string, unknown>) {
    return this.service.save(body);
  }

  @UseGuards(AdminGuard)
  @Put("admin/recipes/:id")
  async update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.service.save(body, id);
  }

  @UseGuards(AdminGuard)
  @Patch("admin/recipes/:id/publish")
  async publish(@Param("id") id: string, @Body() body: { isPublished?: boolean }) {
    return this.service.setPublished(id, !!body.isPublished);
  }

  @UseGuards(AdminGuard)
  @Delete("admin/recipes/:id")
  async remove(@Param("id") id: string) {
    return this.service.delete(id);
  }

  @UseGuards(AdminGuard)
  @Post("admin/uploads/recipe-image")
  @UseInterceptors(FileInterceptor("file", { storage }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Recipe image file is required");
    const root = join(process.cwd(), "uploads");
    const relativePath = relative(root, file.path).replace(/\\/g, "/");
    return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}` };
  }
}
