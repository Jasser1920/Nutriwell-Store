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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const admin_guard_1 = require("../auth/admin.guard");
const contact_service_1 = require("./contact.service");
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const email = String((req.body?.email ?? "anonymous")).toLowerCase().replace(/[^a-z0-9@._-]/g, "-") || "anonymous";
        const dir = (0, path_1.join)(process.cwd(), "uploads", "contact-attachments", email);
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safe = file.originalname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
        cb(null, `${Date.now()}-${safe || "attachment"}`);
    },
});
let ContactController = class ContactController {
    constructor(service) {
        this.service = service;
    }
    async create(body) {
        return this.service.create(body);
    }
    async listAdmin() {
        return { reports: await this.service.listAdmin() };
    }
    async byId(id) {
        return { report: await this.service.getAdminById(id) };
    }
    async updateStatus(id, body) {
        return this.service.updateStatus(id, body.status ?? "");
    }
    async upload(file) {
        if (!file)
            throw new common_1.BadRequestException("Attachment file is required");
        const root = (0, path_1.join)(process.cwd(), "uploads");
        const relativePath = (0, path_1.relative)(root, file.path).replace(/\\/g, "/");
        return {
            path: `/uploads/${relativePath}`,
            url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/uploads/${relativePath}`,
        };
    }
    async attachment(path) {
        const normalized = path.startsWith("/") ? path : `/${path}`;
        return { url: `${(process.env.PUBLIC_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "")}${normalized}` };
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)("contact-reports"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/contact-reports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "listAdmin", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/contact-reports/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "byId", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)("admin/contact-reports/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)("uploads/contact-attachment"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "upload", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)("admin/contact-reports/attachment"),
    __param(0, (0, common_1.Query)("path")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "attachment", null);
exports.ContactController = ContactController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map