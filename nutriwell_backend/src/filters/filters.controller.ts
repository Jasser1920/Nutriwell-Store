import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { FiltersService } from "./filters.service";

@Controller()
export class FiltersController {
  constructor(private readonly service: FiltersService) {}

  @Get("filters")
  async publicList() {
    return { filters: await this.service.listPublic() };
  }

  @UseGuards(AdminGuard)
  @Get("admin/filters")
  async adminList() {
    return { categories: await this.service.listAdmin() };
  }

  @UseGuards(AdminGuard)
  @Post("admin/filter-categories")
  async createCategory(@Body() body: Record<string, unknown>) {
    return this.service.createCategory(body);
  }

  @UseGuards(AdminGuard)
  @Put("admin/filter-categories/:id")
  async updateCategory(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.service.updateCategory(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete("admin/filter-categories/:id")
  async deleteCategory(@Param("id") id: string) {
    return this.service.removeCategory(id);
  }

  @UseGuards(AdminGuard)
  @Post("admin/filter-options")
  async createOption(@Body() body: Record<string, unknown>) {
    return this.service.createOption(body);
  }

  @UseGuards(AdminGuard)
  @Put("admin/filter-options/:id")
  async updateOption(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.service.updateOption(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete("admin/filter-options/:id")
  async deleteOption(@Param("id") id: string) {
    return this.service.removeOption(id);
  }
}
