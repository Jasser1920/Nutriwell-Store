import { Module } from "@nestjs/common";
import { MysqlModule } from "../common/mysql.module";
import { AuthModule } from "../auth/auth.module";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";

@Module({
  imports: [MysqlModule, AuthModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
