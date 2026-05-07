import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { LocationsService } from "./locations.service";

@Controller()
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Get("locations")
  async list() {
    return { locations: await this.service.list() };
  }

  @UseGuards(AdminGuard)
  @Post("admin/locations")
  async create(@Body() body: Record<string, unknown>) {
    return this.service.create(body);
  }

  @UseGuards(AdminGuard)
  @Put("admin/locations/:id")
  async update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.service.update(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete("admin/locations/:id")
  async remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
