"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const mysql_module_1 = require("./common/mysql.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const recipes_module_1 = require("./recipes/recipes.module");
const contact_module_1 = require("./contact/contact.module");
const content_module_1 = require("./content/content.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [mysql_module_1.MysqlModule, auth_module_1.AuthModule, products_module_1.ProductsModule, recipes_module_1.RecipesModule, contact_module_1.ContactModule, content_module_1.ContentModule],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map