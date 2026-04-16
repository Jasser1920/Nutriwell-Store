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
exports.MysqlService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let MysqlService = class MysqlService {
    constructor() {
        this.pool = (0, promise_1.createPool)({
            host: process.env.DB_HOST ?? "127.0.0.1",
            port: Number(process.env.DB_PORT ?? 3306),
            user: process.env.DB_USER ?? "root",
            password: process.env.DB_PASSWORD ?? "",
            database: process.env.DB_NAME ?? "nutriwell",
            waitForConnections: true,
            connectionLimit: 10,
            decimalNumbers: true,
        });
    }
    query(sql, params = []) {
        return this.pool.query(sql, params);
    }
    execute(sql, params = []) {
        return this.pool.execute(sql, params);
    }
    async transaction(runner) {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            const result = await runner(conn);
            await conn.commit();
            return result;
        }
        catch (error) {
            await conn.rollback();
            throw error;
        }
        finally {
            conn.release();
        }
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
};
exports.MysqlService = MysqlService;
exports.MysqlService = MysqlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MysqlService);
//# sourceMappingURL=mysql.service.js.map