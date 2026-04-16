import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MysqlModule } from "./common/mysql.module";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { RecipesModule } from "./recipes/recipes.module";
import { ContactModule } from "./contact/contact.module";
import { ContentModule } from "./content/content.module";

@Module({
  imports: [MysqlModule, AuthModule, ProductsModule, RecipesModule, ContactModule, ContentModule],
  controllers: [AppController],
})
export class AppModule {}
