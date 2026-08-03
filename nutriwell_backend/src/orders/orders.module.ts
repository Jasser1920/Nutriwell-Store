import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MysqlModule } from "../common/mysql.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [MysqlModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
