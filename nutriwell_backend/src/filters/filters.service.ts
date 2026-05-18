import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => (v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : 0);
const bool = (v: unknown) => v === true || v === 1 || v === "1" || v === "true";
const slugify = (value: unknown) =>
  str(value)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

@Injectable()
export class FiltersService {
  constructor(private readonly db: MysqlService) {}

  private async ensureTables() {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS filter_categories (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        key_name VARCHAR(191) NOT NULL,
        label VARCHAR(191) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_filter_categories_key (key_name)
      ) ENGINE=InnoDB
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS filter_options (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        category_id BIGINT UNSIGNED NOT NULL,
        label VARCHAR(191) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_filter_options_slug (slug),
        KEY idx_filter_options_cat (category_id, sort_order),
        CONSTRAINT fk_filter_options_category FOREIGN KEY (category_id) REFERENCES filter_categories (id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  private async getCategoryById(id: string) {
    const [rows] = await this.db.query<RowDataPacket[]>("SELECT * FROM filter_categories WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0] ?? null;
  }

  private async getCategoryByKey(keyName: string) {
    const [rows] = await this.db.query<RowDataPacket[]>("SELECT * FROM filter_categories WHERE key_name = ? LIMIT 1", [keyName]);
    return (rows as any[])[0] ?? null;
  }

  private async getOptionById(id: string) {
    const [rows] = await this.db.query<RowDataPacket[]>("SELECT * FROM filter_options WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0] ?? null;
  }

  async listPublic() {
    await this.ensureTables();

    const [cats] = await this.db.query<any[]>("SELECT id, key_name, label, sort_order FROM filter_categories ORDER BY sort_order ASC, id ASC");
    if (!cats || !cats.length) return {};

    const catIds = cats.map((c) => c.id);
    const placeholders = catIds.map(() => "?").join(",");
    const [opts] = await this.db.query<any[]>(
      `SELECT id, category_id, label, slug, sort_order FROM filter_options WHERE is_active = 1 AND category_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
      catIds,
    );

    const grouped: Record<string, { label: string; options: Array<{ id: string; label: string; slug: string }> }> = {};
    for (const c of cats) grouped[c.key_name] = { label: c.label, options: [] };
    for (const o of opts as any[]) {
      const cat = cats.find((c) => c.id === o.category_id);
      if (!cat) continue;
      grouped[cat.key_name].options.push({ id: String(o.id), label: o.label, slug: o.slug });
    }

    return grouped;
  }

  async listAdmin() {
    await this.ensureTables();

    const [categories] = await this.db.query<RowDataPacket[]>("SELECT * FROM filter_categories ORDER BY sort_order ASC, id ASC");
    const [options] = await this.db.query<RowDataPacket[]>("SELECT * FROM filter_options ORDER BY sort_order ASC, id ASC");

    return (categories as any[]).map((category) => ({
      id: String(category.id),
      keyName: category.key_name,
      label: category.label,
      sortOrder: Number(category.sort_order ?? 0),
      options: (options as any[])
        .filter((option) => String(option.category_id) === String(category.id))
        .map((option) => ({
          id: String(option.id),
          categoryId: String(option.category_id),
          label: option.label,
          slug: option.slug,
          isActive: !!option.is_active,
          sortOrder: Number(option.sort_order ?? 0),
        })),
    }));
  }

  async createCategory(body: Record<string, unknown>) {
    await this.ensureTables();

    const keyName = slugify(body.keyName ?? body.key_name ?? body.label);
    const label = str(body.label);
    if (!keyName) throw new BadRequestException("Category key is required");
    if (!label) throw new BadRequestException("Category label is required");

    const existing = await this.getCategoryByKey(keyName);
    if (existing) throw new BadRequestException("Category key already exists");

    const [res] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO filter_categories (key_name, label, sort_order) VALUES (?, ?, ?)",
      [keyName, label, num(body.sortOrder ?? body.sort_order)],
    );
    return { id: String(res.insertId) };
  }

  async updateCategory(id: string, body: Record<string, unknown>) {
    await this.ensureTables();

    const current = await this.getCategoryById(id);
    if (!current) throw new NotFoundException("Category not found");

    const keyName = slugify(body.keyName ?? body.key_name ?? current.key_name);
    const label = str(body.label) || String(current.label);
    const sortOrder = body.sortOrder ?? body.sort_order ?? current.sort_order;

    const conflict = await this.db.query<RowDataPacket[]>(
      "SELECT id FROM filter_categories WHERE key_name = ? AND id <> ? LIMIT 1",
      [keyName, id],
    );
    if ((conflict[0] as any[]).length) throw new BadRequestException("Category key already exists");

    const [res] = await this.db.execute<ResultSetHeader>(
      "UPDATE filter_categories SET key_name = ?, label = ?, sort_order = ? WHERE id = ?",
      [keyName, label, num(sortOrder), id],
    );
    if (!res.affectedRows) throw new NotFoundException("Category not found");
    return { id };
  }

  async removeCategory(id: string) {
    await this.ensureTables();

    const [res] = await this.db.execute<ResultSetHeader>("DELETE FROM filter_categories WHERE id = ?", [id]);
    if (!res.affectedRows) throw new NotFoundException("Category not found");
    return { success: true };
  }

  async createOption(body: Record<string, unknown>) {
    await this.ensureTables();

    const category = str(body.categoryKey) ? await this.getCategoryByKey(str(body.categoryKey)) : await this.getCategoryById(str(body.categoryId));
    if (!category) throw new BadRequestException("Category is required");

    const label = str(body.label);
    if (!label) throw new BadRequestException("Option label is required");

    const slug = slugify(body.slug || label);
    if (!slug) throw new BadRequestException("Option slug is required");

    const [existing] = await this.db.query<RowDataPacket[]>("SELECT id FROM filter_options WHERE slug = ? LIMIT 1", [slug]);
    if ((existing as any[]).length) throw new BadRequestException("Option slug already exists");

    const [res] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO filter_options (category_id, label, slug, is_active, sort_order) VALUES (?, ?, ?, ?, ?)",
      [category.id, label, slug, bool(body.isActive ?? body.is_active) ? 1 : 0, num(body.sortOrder ?? body.sort_order)],
    );
    return { id: String(res.insertId) };
  }

  async updateOption(id: string, body: Record<string, unknown>) {
    await this.ensureTables();

    const current = await this.getOptionById(id);
    if (!current) throw new NotFoundException("Option not found");

    const category = str(body.categoryKey)
      ? await this.getCategoryByKey(str(body.categoryKey))
      : str(body.categoryId)
        ? await this.getCategoryById(str(body.categoryId))
        : await this.getCategoryById(String(current.category_id));
    if (!category) throw new BadRequestException("Category is required");

    const label = str(body.label) || String(current.label);
    const slug = slugify(body.slug || current.slug || label);
    if (!slug) throw new BadRequestException("Option slug is required");

    const [existing] = await this.db.query<RowDataPacket[]>("SELECT id FROM filter_options WHERE slug = ? AND id <> ? LIMIT 1", [slug, id]);
    if ((existing as any[]).length) throw new BadRequestException("Option slug already exists");

    const [res] = await this.db.execute<ResultSetHeader>(
      "UPDATE filter_options SET category_id = ?, label = ?, slug = ?, is_active = ?, sort_order = ? WHERE id = ?",
      [category.id, label, slug, bool(body.isActive ?? body.is_active ?? current.is_active) ? 1 : 0, num(body.sortOrder ?? body.sort_order ?? current.sort_order), id],
    );
    if (!res.affectedRows) throw new NotFoundException("Option not found");
    return { id };
  }

  async removeOption(id: string) {
    await this.ensureTables();

    const [res] = await this.db.execute<ResultSetHeader>("DELETE FROM filter_options WHERE id = ?", [id]);
    if (!res.affectedRows) throw new NotFoundException("Option not found");
    return { success: true };
  }
}
