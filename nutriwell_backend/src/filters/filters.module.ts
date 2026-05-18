import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { FiltersController } from "./filters.controller";
import { FiltersService } from "./filters.service";

@Module({
  imports: [AuthModule],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
