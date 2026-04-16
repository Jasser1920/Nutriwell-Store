import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

type AdminUser = RowDataPacket & {
  id: number;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: string;
  is_active: number;
};

@Injectable()
export class AuthService {
  constructor(private readonly mysql: MysqlService) {}

  cookieName() {
    return process.env.SESSION_COOKIE_NAME ?? "nutriwell_session";
  }

  cookieOptions() {
    return {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: false,
      path: "/",
      maxAge: Number(process.env.SESSION_TTL_DAYS ?? 7) * 24 * 60 * 60 * 1000,
    };
  }

  async ensureAdmin() {
    const email = (process.env.ADMIN_EMAIL ?? "admin@nutriwell.local").trim().toLowerCase();
    const password = (process.env.ADMIN_PASSWORD ?? "Admin123!").trim();
    const fullName = (process.env.ADMIN_FULL_NAME ?? "Nutriwell Admin").trim();

    const [rows] = await this.mysql.query<AdminUser[]>("SELECT id FROM admin_users WHERE email = ? LIMIT 1", [email]);
    if (rows.length) return;

    const hash = await bcrypt.hash(password, 10);
    await this.mysql.execute(
      "INSERT INTO admin_users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, 'admin', 1)",
      [email, hash, fullName],
    );
  }

  async login(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    const [rows] = await this.mysql.query<AdminUser[]>(
      "SELECT id, email, password_hash, full_name, role, is_active FROM admin_users WHERE email = ? LIMIT 1",
      [normalized],
    );
    const user = rows[0];
    if (!user || !user.is_active) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + Number(process.env.SESSION_TTL_DAYS ?? 7) * 24 * 60 * 60 * 1000);

    await this.mysql.execute(
      "INSERT INTO admin_sessions (session_token, admin_user_id, expires_at) VALUES (?, ?, ?)",
      [token, user.id, expiresAt],
    );

    return {
      token,
      expiresAt: expiresAt.toISOString(),
      user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
    };
  }

  async logout(token?: string) {
    if (!token) return;
    await this.mysql.execute("UPDATE admin_sessions SET revoked_at = NOW() WHERE session_token = ?", [token]);
  }

  async session(token?: string) {
    if (!token) return null;
    const [rows] = await this.mysql.query<RowDataPacket[]>(
      `SELECT s.session_token, s.expires_at, s.revoked_at, u.id, u.email, u.full_name, u.role, u.is_active
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_user_id
       WHERE s.session_token = ? LIMIT 1`,
      [token],
    );
    const row = rows[0] as any;
    if (!row) return null;
    if (!row.is_active || row.revoked_at) return null;
    if (new Date(row.expires_at).getTime() <= Date.now()) return null;
    return {
      token: row.session_token,
      expiresAt: new Date(row.expires_at).toISOString(),
      user: { id: row.id, email: row.email, fullName: row.full_name, role: row.role },
    };
  }
}
