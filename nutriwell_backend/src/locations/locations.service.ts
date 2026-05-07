import { Injectable, NotFoundException } from "@nestjs/common";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => (v != null && !isNaN(Number(v)) ? Number(v) : null);

@Injectable()
export class LocationsService {
  constructor(private readonly db: MysqlService) {}

  private async ensureTable() {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS pharmacy_locations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(191) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(191) NOT NULL,
        distance VARCHAR(64) DEFAULT NULL,
        lat DOUBLE NOT NULL,
        lng DOUBLE NOT NULL,
        phone VARCHAR(64) DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);
  }

  private map(r: any) {
    return {
      id: String(r.id),
      name: String(r.name),
      address: String(r.address),
      city: String(r.city),
      distance: r.distance ?? "",
      lat: Number(r.lat),
      lng: Number(r.lng),
      phone: r.phone ?? "",
    };
  }

  async list() {
    await this.ensureTable();
    const [rows] = await this.db.query<RowDataPacket[]>(
      "SELECT * FROM pharmacy_locations ORDER BY city, name",
    );
    return (rows as any[]).map((r) => this.map(r));
  }

  async create(body: Record<string, unknown>) {
    await this.ensureTable();
    const [res] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO pharmacy_locations (name, address, city, distance, lat, lng, phone) VALUES (?,?,?,?,?,?,?)",
      [str(body.name), str(body.address), str(body.city), str(body.distance) || null, num(body.lat), num(body.lng), str(body.phone) || null],
    );
    return { id: String(res.insertId) };
  }

  async update(id: string, body: Record<string, unknown>) {
    await this.ensureTable();
    const [res] = await this.db.execute<ResultSetHeader>(
      "UPDATE pharmacy_locations SET name=?, address=?, city=?, distance=?, lat=?, lng=?, phone=? WHERE id=?",
      [str(body.name), str(body.address), str(body.city), str(body.distance) || null, num(body.lat), num(body.lng), str(body.phone) || null, id],
    );
    if (!res.affectedRows) throw new NotFoundException("Location not found");
    return { id };
  }

  async remove(id: string) {
    await this.ensureTable();
    const [res] = await this.db.execute<ResultSetHeader>(
      "DELETE FROM pharmacy_locations WHERE id=?",
      [id],
    );
    if (!res.affectedRows) throw new NotFoundException("Location not found");
    return { success: true };
  }
}
