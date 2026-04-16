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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const admin_guard_1 = require("../auth/admin.guard");
const content_service_1 = require("./content.service");
const normalizeSegment = (value, fallback) => String(value ?? fallback)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const pageKey = normalizeSegment(req.body?.pageKey, "page");
        const section = normalizeSegment(req.body?.section, "section");
        const field = normalizeSegment(req.body?.field, "image");
        const dir = (0, path_1.join)(process.cwd(), "uploads", "content", pageKey, section, field);
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
        cb(null, `${Date.now()}-${safe || "content-image.jpg"}`);
    },
});
let ContentController = class ContentController {
    constructor(service) {
        this.service = service;
    }
    async getPublic(pageKey) {
        return this.service.get(pageKey);
    }
    async getAdmin(pageKey) {
        return this.service.get(pageKey);
    }
    async save(pageKey, body) {
        return this.service.save(pageKey, body.content ?? {});
    }
    async upload(file) {
        if (!file)
            throw new common_1.BadRequestException("Content image file is required");
        const root = (0, path_1.join)(process.cwd(), "uploads");
        const relativePath = (0, path_1.relative)(root, file.path).replace(/\\/g, "/");
        return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}` };
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)("content/:pageKey"),
    __param(0, (0, common_1.Param)("pageKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getPublic", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/content/:pageKey"),
    __param(0, (0, common_1.Param)("pageKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Put)("admin/content/:pageKey"),
    __param(0, (0, common_1.Param)("pageKey")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "save", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)("admin/uploads/content-image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "upload", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map