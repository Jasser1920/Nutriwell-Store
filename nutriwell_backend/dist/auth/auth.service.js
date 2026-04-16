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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const mysql_service_1 = require("../common/mysql.service");
let AuthService = class AuthService {
    constructor(mysql) {
        this.mysql = mysql;
    }
    cookieName() {
        return process.env.SESSION_COOKIE_NAME ?? "nutriwell_session";
    }
    cookieOptions() {
        return {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: Number(process.env.SESSION_TTL_DAYS ?? 7) * 24 * 60 * 60 * 1000,
        };
    }
    async ensureAdmin() {
        const email = (process.env.ADMIN_EMAIL ?? "admin@nutriwell.local").trim().toLowerCase();
        const password = (process.env.ADMIN_PASSWORD ?? "Admin123!").trim();
        const fullName = (process.env.ADMIN_FULL_NAME ?? "Nutriwell Admin").trim();
        const [rows] = await this.mysql.query("SELECT id FROM admin_users WHERE email = ? LIMIT 1", [email]);
        if (rows.length)
            return;
        const hash = await bcryptjs_1.default.hash(password, 10);
        await this.mysql.execute("INSERT INTO admin_users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, 'admin', 1)", [email, hash, fullName]);
    }
    async login(email, password) {
        const normalized = email.trim().toLowerCase();
        const [rows] = await this.mysql.query("SELECT id, email, password_hash, full_name, role, is_active FROM admin_users WHERE email = ? LIMIT 1", [normalized]);
        const user = rows[0];
        if (!user || !user.is_active)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const ok = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!ok)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const token = (0, crypto_1.randomBytes)(32).toString("hex");
        const expiresAt = new Date(Date.now() + Number(process.env.SESSION_TTL_DAYS ?? 7) * 24 * 60 * 60 * 1000);
        await this.mysql.execute("INSERT INTO admin_sessions (session_token, admin_user_id, expires_at) VALUES (?, ?, ?)", [token, user.id, expiresAt]);
        return {
            token,
            expiresAt: expiresAt.toISOString(),
            user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
        };
    }
    async logout(token) {
        if (!token)
            return;
        await this.mysql.execute("UPDATE admin_sessions SET revoked_at = NOW() WHERE session_token = ?", [token]);
    }
    async session(token) {
        if (!token)
            return null;
        const [rows] = await this.mysql.query(`SELECT s.session_token, s.expires_at, s.revoked_at, u.id, u.email, u.full_name, u.role, u.is_active
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_user_id
       WHERE s.session_token = ? LIMIT 1`, [token]);
        const row = rows[0];
        if (!row)
            return null;
        if (!row.is_active || row.revoked_at)
            return null;
        if (new Date(row.expires_at).getTime() <= Date.now())
            return null;
        return {
            token: row.session_token,
            expiresAt: new Date(row.expires_at).toISOString(),
            user: { id: row.id, email: row.email, fullName: row.full_name, role: row.role },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService])
], AuthService);
//# sourceMappingURL=auth.service.js.map