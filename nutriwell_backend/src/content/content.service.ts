import { Injectable } from "@nestjs/common";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

@Injectable()
export class ContentService {
  constructor(private readonly db: MysqlService) {}

  private normalizePageKey(pageKey: string) {
    return String(pageKey || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  private async ensureTable() {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS page_contents (
        page_key VARCHAR(191) NOT NULL,
        content_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (page_key)
      ) ENGINE=InnoDB
    `);
  }

  async get(pageKey: string) {
    await this.ensureTable();
    const key = this.normalizePageKey(pageKey);
    const [rows] = await this.db.query<RowDataPacket[]>(
      "SELECT page_key, content_json, updated_at FROM page_contents WHERE page_key = ? LIMIT 1",
      [key],
    );

    const row: any = rows[0];
    if (!row) {
      return { pageKey: key, content: null, updatedAt: null };
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(row.content_json);
    } catch {
      parsed = null;
    }

    return {
      pageKey: row.page_key,
      content: parsed,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    };
  }

  async save(pageKey: string, content: unknown) {
    await this.ensureTable();
    const key = this.normalizePageKey(pageKey);
    const payload = JSON.stringify(content ?? {});

    await this.db.execute<ResultSetHeader>(
      `INSERT INTO page_contents (page_key, content_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP`,
      [key, payload],
    );

    return this.get(key);
  }
}
