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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const admin_guard_1 = require("../auth/admin.guard");
const products_service_1 = require("./products.service");
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const slug = String((req.body?.slug ?? "draft-product")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
        const folder = String((req.body?.folder ?? "gallery")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
        const dir = (0, path_1.join)(process.cwd(), "uploads", "products", slug, folder);
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
        cb(null, `${Date.now()}-${safe || "image.jpg"}`);
    },
});
let ProductsController = class ProductsController {
    constructor(service) {
        this.service = service;
    }
    async list(query) {
        return { products: await this.service.listPublic(query) };
    }
    async bySlug(slug) {
        return { product: await this.service.getPublicBySlug(slug) };
    }
    async adminList() {
        return { products: await this.service.listAdmin() };
    }
    async adminById(id) {
        return { product: await this.service.getAdminById(id) };
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
    async delete(id) {
        return this.service.delete(id);
    }
    async upload(file) {
        if (!file)
            throw new common_1.BadRequestException("Product image file is required");
        const root = (0, path_1.join)(process.cwd(), "uploads");
        const relativePath = (0, path_1.relative)(root, file.path).replace(/\\/g, "/");
        return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}` };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)("products"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("products/:slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bySlug", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/products"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "adminList", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "adminById", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)("admin/products"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Put)("admin/products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)("admin/products/:id/publish"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "publish", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)("admin/products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)("admin/uploads/product-image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "upload", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map