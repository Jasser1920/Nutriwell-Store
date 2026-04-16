"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const admin_guard_1 = require("../auth/admin.guard");
const recipes_service_1 = require("./recipes.service");
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const slug = String((req.body?.slug ?? "draft-recipe")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
        const dir = (0, path_1.join)(process.cwd(), "uploads", "recipes", slug);
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
        cb(null, `${Date.now()}-${safe || "recipe.jpg"}`);
    },
});
let RecipesController = class RecipesController {
    constructor(service) {
        this.service = service;
    }
    async list(query) {
        return { recipes: await this.service.listPublic(query) };
    }
    async bySlug(slug) {
        return { recipe: await this.service.getPublicBySlug(slug) };
    }
    async adminList() {
        return { recipes: await this.service.listAdmin() };
    }
    async adminById(id) {
        return { recipe: await this.service.getAdminById(id) };
    }
    async create(body) {
        return this.service.save(body);
    }
    async update(id, body) {
        return this.service.save(body, id);
    }
    async publish(id, body) {
        return this.service.setPublished(id, !!body.isPublished);
    }
    async remove(id) {
        return this.service.delete(id);
    }
    async upload(file) {
        if (!file)
            throw new common_1.BadRequestException("Recipe image file is required");
        const root = (0, path_1.join)(process.cwd(), "uploads");
        const relativePath = (0, path_1.relative)(root, file.path).replace(/\\/g, "/");
        return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}` };
    }
};
exports.RecipesController = RecipesController;
__decorate([
    (0, common_1.Get)("recipes"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("recipes/:slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "bySlug", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/recipes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "adminList", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/recipes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "adminById", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)("admin/recipes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Put)("admin/recipes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)("admin/recipes/:id/publish"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "publish", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)("admin/recipes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)("admin/uploads/recipe-image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "upload", null);
exports.RecipesController = RecipesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [recipes_service_1.RecipesService])
], RecipesController);
//# sourceMappingURL=recipes.controller.js.map