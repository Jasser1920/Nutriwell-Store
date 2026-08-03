import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { OrdersService } from "./orders.service";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("orders")
  async createOrder(@Body() body: any) {
    return this.ordersService.createOrder(body);
  }

  @Get("orders/:reference")
  async getOrderByReference(@Param("reference") reference: string) {
    return { order: await this.ordersService.getOrderByReference(reference) };
  }

  @UseGuards(AdminGuard)
  @Get("admin/orders")
  async listAdminOrders(@Query("status") status?: string) {
    return { orders: await this.ordersService.listAdminOrders(status) };
  }

  @UseGuards(AdminGuard)
  @Patch("admin/orders/:id/status")
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() body: { status: "en_attente" | "acceptee" | "refusee" },
  ) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  @UseGuards(AdminGuard)
  @Delete("admin/orders/:id")
  async deleteOrder(@Param("id") id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
