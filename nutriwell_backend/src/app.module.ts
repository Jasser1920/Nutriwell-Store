import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MysqlModule } from "./common/mysql.module";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { FiltersModule } from "./filters/filters.module";
import { RecipesModule } from "./recipes/recipes.module";
import { ContactModule } from "./contact/contact.module";
import { ContentModule } from "./content/content.module";
import { LocationsModule } from "./locations/locations.module";

@Module({
  imports: [MysqlModule, AuthModule, ProductsModule, FiltersModule, RecipesModule, ContactModule, ContentModule, LocationsModule],
  controllers: [AppController],
})
export class AppModule {}
