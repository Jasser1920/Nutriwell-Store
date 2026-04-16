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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../common/mysql.service");
const str = (v) => (typeof v === "string" ? v.trim() : "");
let ContactService = class ContactService {
    constructor(db) {
        this.db = db;
    }
    async create(body) {
        const required = {
            subject: str(body.subject),
            message: str(body.message),
            email: str(body.email),
            last_name: str(body.last_name ?? body.lastName),
            first_name: str(body.first_name ?? body.firstName),
        };
        if (!required.subject || !required.message || !required.email || !required.last_name || !required.first_name) {
            throw new common_1.BadRequestException("Missing required contact fields");
        }
        const [res] = await this.db.execute(`INSERT INTO contact_reports
       (subject, message, email, profile_type, civility, last_name, first_name, address, postal_code, city, country, phone_prefix, phone_number, attachment_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouveau')`, [
            required.subject,
            required.message,
            required.email,
            str(body.profile_type ?? body.profileType) || null,
            str(body.civility) || null,
            required.last_name,
            required.first_name,
            str(body.address) || null,
            str(body.postal_code ?? body.postalCode) || null,
            str(body.city) || null,
            str(body.country) || null,
            str(body.phone_prefix ?? body.phonePrefix) || null,
            str(body.phone_number ?? body.phoneNumber) || null,
            str(body.attachment_url ?? body.attachmentUrl) || null,
        ]);
        return { id: String(res.insertId) };
    }
    async listAdmin() {
        const [rows] = await this.db.query("SELECT id, subject, email, last_name, first_name, status, created_at FROM contact_reports ORDER BY created_at DESC");
        return rows.map((r) => ({ ...r, id: String(r.id) }));
    }
    async getAdminById(id) {
        const [rows] = await this.db.query("SELECT id, subject, email, last_name, first_name, status, created_at, message, profile_type, civility, address, postal_code, city, country, phone_prefix, phone_number, attachment_url FROM contact_reports WHERE id = ? LIMIT 1", [id]);
        const row = rows[0];
        if (!row)
            throw new common_1.NotFoundException("Contact report not found");
        return { ...row, id: String(row.id) };
    }
    async updateStatus(id, status) {
        const s = str(status);
        if (!["nouveau", "traite", "archive"].includes(s))
            throw new common_1.BadRequestException("Invalid status");
        const [res] = await this.db.execute("UPDATE contact_reports SET status = ? WHERE id = ?", [s, id]);
        if (!res.affectedRows)
            throw new common_1.NotFoundException("Contact report not found");
        return { success: true };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService])
], ContactService);
//# sourceMappingURL=contact.service.js.map