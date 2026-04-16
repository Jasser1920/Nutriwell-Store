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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../common/mysql.service");
let ContentService = class ContentService {
    constructor(db) {
        this.db = db;
    }
    normalizePageKey(pageKey) {
        return String(pageKey || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    }
    async ensureTable() {
        await this.db.execute(`
      CREATE TABLE IF NOT EXISTS page_contents (
        page_key VARCHAR(191) NOT NULL,
        content_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (page_key)
      ) ENGINE=InnoDB
    `);
    }
    async get(pageKey) {
        await this.ensureTable();
        const key = this.normalizePageKey(pageKey);
        const [rows] = await this.db.query("SELECT page_key, content_json, updated_at FROM page_contents WHERE page_key = ? LIMIT 1", [key]);
        const row = rows[0];
        if (!row) {
            return { pageKey: key, content: null, updatedAt: null };
        }
        let parsed = null;
        try {
            parsed = JSON.parse(row.content_json);
        }
        catch {
            parsed = null;
        }
        return {
            pageKey: row.page_key,
            content: parsed,
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
        };
    }
    async save(pageKey, content) {
        await this.ensureTable();
        const key = this.normalizePageKey(pageKey);
        const payload = JSON.stringify(content ?? {});
        await this.db.execute(`INSERT INTO page_contents (page_key, content_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP`, [key, payload]);
        return this.get(key);
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService])
], ContentService);
//# sourceMappingURL=content.service.js.map