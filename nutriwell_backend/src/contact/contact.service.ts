import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

@Injectable()
export class ContactService {
  constructor(private readonly db: MysqlService) {}

  async create(body: Record<string, unknown>) {
    const required = {
      subject: str(body.subject),
      message: str(body.message),
      email: str(body.email),
      last_name: str(body.last_name ?? body.lastName),
      first_name: str(body.first_name ?? body.firstName),
    };
    if (!required.subject || !required.message || !required.email || !required.last_name || !required.first_name) {
      throw new BadRequestException("Missing required contact fields");
    }

    const [res] = await this.db.execute<ResultSetHeader>(
      `INSERT INTO contact_reports
       (subject, message, email, profile_type, civility, last_name, first_name, address, postal_code, city, country, phone_prefix, phone_number, attachment_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouveau')`,
      [
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
      ],
    );

    return { id: String(res.insertId) };
  }

  async listAdmin() {
    const [rows] = await this.db.query<RowDataPacket[]>("SELECT id, subject, email, last_name, first_name, status, created_at FROM contact_reports ORDER BY created_at DESC");
    return (rows as any[]).map((r) => ({ ...r, id: String(r.id) }));
  }

  async getAdminById(id: string) {
    const [rows] = await this.db.query<RowDataPacket[]>(
      "SELECT id, subject, email, last_name, first_name, status, created_at, message, profile_type, civility, address, postal_code, city, country, phone_prefix, phone_number, attachment_url FROM contact_reports WHERE id = ? LIMIT 1",
      [id],
    );
    const row: any = rows[0];
    if (!row) throw new NotFoundException("Contact report not found");
    return { ...row, id: String(row.id) };
  }

  async updateStatus(id: string, status: string) {
    const s = str(status);
    if (!["nouveau", "traite", "archive"].includes(s)) throw new BadRequestException("Invalid status");
    const [res] = await this.db.execute<ResultSetHeader>("UPDATE contact_reports SET status = ? WHERE id = ?", [s, id]);
    if (!res.affectedRows) throw new NotFoundException("Contact report not found");
    return { success: true };
  }
}
