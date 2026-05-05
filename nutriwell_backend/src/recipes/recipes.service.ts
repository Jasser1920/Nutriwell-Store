import { Injectable, NotFoundException } from "@nestjs/common";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
/** Accept camelCase or snake_case from JSON clients (e.g. frontend sends prep_time). */
const strField = (body: Record<string, unknown>, camel: string, snake: string) =>
  str(body[camel] ?? body[snake]);

const boolField = (body: Record<string, unknown>, camel: string, snake: string): boolean => {
  const a = body[camel];
  const b = body[snake];
  if (typeof a === "boolean") return a;
  if (typeof b === "boolean") return b;
  if (a === 1 || a === "1") return true;
  if (b === 1 || b === "1") return true;
  return false;
};
const arr = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : []);
const parseArray = (raw: unknown) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
};

type NutritionTable = {
  headers: string[];
  rows: string[][];
};

@Injectable()
export class RecipesService {
  constructor(private readonly db: MysqlService) {}

  private normalizeNutritionTable(raw: unknown): NutritionTable | null {
    if (!raw || typeof raw !== "object") return null;

    const table = raw as { headers?: unknown; rows?: unknown };
    const headers = Array.isArray(table.headers)
      ? table.headers.map((header, index) => str(header) || `Colonne ${index + 1}`).filter(Boolean)
      : [];
    const rows = Array.isArray(table.rows)
      ? table.rows.map((row) => (Array.isArray(row) ? row.map((cell) => str(cell)) : []))
      : [];

    if (!headers.length) return null;

    const normalizedRows = rows
      .map((row) => Array.from({ length: headers.length }, (_, index) => row[index] ?? ""))
      .filter((row) => row.some((cell) => cell.length > 0));

    return {
      headers,
      rows: normalizedRows,
    };
  }

  private parseNutritionTableJson(raw: unknown): NutritionTable | null {
    if (!raw || typeof raw !== "string") return null;
    try {
      return this.normalizeNutritionTable(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  private nutritionRowsFromLegacy(raw: string[]): string[][] {
    return raw
      .map((line) => {
        const match = line.match(/^([^:]+):\s*(.+?)\s*\/\s*(.+)$/);
        if (!match) return [line.trim(), "", ""];
        return [match[1].trim(), match[2].trim(), match[3].trim()];
      })
      .filter((row) => row.some((cell) => cell.length > 0));
  }

  private legacyNutritionFromTable(table: NutritionTable | null): string[] {
    if (!table) return [];

    return table.rows
      .map((row) => {
        const nutriment = row[0] ?? "";
        const per100ml = row[1] ?? "";
        const perPortion = row[2] ?? "";
        if (!nutriment && !per100ml && !perPortion) return "";
        return `${nutriment}: ${per100ml} / ${perPortion}`.trim();
      })
      .filter(Boolean);
  }

  private async ensureNutritionTableColumn() {
    const [rows] = await this.db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS c
       FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = 'recipes' AND column_name = 'nutrition_table_json'`,
    );

    const count = Number((rows[0] as any)?.c ?? 0);
    if (count > 0) return;

    await this.db.execute("ALTER TABLE recipes ADD COLUMN nutrition_table_json LONGTEXT NULL");
  }

  private async ensureRelatedProductSlugColumn() {
    const [rows] = await this.db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS c
       FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = 'recipes' AND column_name = 'related_product_slug'`,
    );

    const count = Number((rows[0] as any)?.c ?? 0);
    if (count > 0) return;

    await this.db.execute("ALTER TABLE recipes ADD COLUMN related_product_slug VARCHAR(191) NULL");
  }

  private async resolvePublishedRelatedProduct(productSlug: string): Promise<{ slug: string; name: string; image: string } | null> {
    const slug = str(productSlug);
    if (!slug) return null;

    const [rows] = await this.db.query<RowDataPacket[]>(
      "SELECT slug, name, image FROM products WHERE slug = ? AND is_published = 1 LIMIT 1",
      [slug],
    );
    const p = rows[0] as any;
    if (!p) return null;

    return {
      slug: String(p.slug),
      name: String(p.name ?? ""),
      image: p.image != null ? String(p.image) : "",
    };
  }

  async listPublic(query: Record<string, unknown>) {
    const where: string[] = ["is_published = 1"];
    const params: any[] = [];
    if (str(query.category) && str(query.category) !== "Toutes") {
      where.push("category = ?");
      params.push(str(query.category));
    }
    const [rows] = await this.db.query<RowDataPacket[]>(`SELECT id, slug, title, category, summary, prep_time, servings, image, is_published, updated_at FROM recipes WHERE ${where.join(" AND ")} ORDER BY updated_at DESC`, params);
    return (rows as any[]).map((r) => ({ ...r, id: String(r.id), is_published: !!r.is_published }));
  }

  async getPublicBySlug(slug: string) {
    await this.ensureNutritionTableColumn();
    await this.ensureRelatedProductSlugColumn();

    const [rows] = await this.db.query<RowDataPacket[]>("SELECT * FROM recipes WHERE slug = ? AND is_published = 1 LIMIT 1", [slug]);
    const r: any = rows[0];
    if (!r) return null;

    const legacyNutrition = parseArray(r.nutrition);
    const nutritionTable =
      this.parseNutritionTableJson(r.nutrition_table_json) ?? {
        headers: ["Nutriment", "Pour 100ml", "Par portion"],
        rows: this.nutritionRowsFromLegacy(legacyNutrition),
      };

    const ingredients = parseArray(r.ingredients);
    const steps = parseArray(r.steps);
    const prepTime =
      r.prep_time != null && String(r.prep_time).trim() !== "" ? String(r.prep_time).trim() : "";

    const relatedSlug =
      r.related_product_slug != null && String(r.related_product_slug).trim() !== ""
        ? String(r.related_product_slug).trim()
        : "";
    const relatedProduct = relatedSlug ? await this.resolvePublishedRelatedProduct(relatedSlug) : null;

    return {
      id: String(r.id),
      slug: r.slug,
      title: r.title,
      category: r.category,
      summary: r.summary,
      prepTime,
      servings: Number(r.servings),
      image: r.image ?? "",
      ingredients,
      steps,
      tips: parseArray(r.tips),
      nutrition: legacyNutrition,
      nutritionTable,
      relatedProduct,
    };
  }

  async listAdmin() {
    const [rows] = await this.db.query<RowDataPacket[]>("SELECT id, slug, title, category, summary, prep_time, servings, image, is_published, updated_at FROM recipes ORDER BY updated_at DESC");
    return (rows as any[]).map((r) => ({ ...r, id: String(r.id), is_published: !!r.is_published }));
  }

  async getAdminById(id: string) {
    await this.ensureNutritionTableColumn();
    await this.ensureRelatedProductSlugColumn();

    const [rows] = await this.db.query<RowDataPacket[]>("SELECT * FROM recipes WHERE id = ? LIMIT 1", [id]);
    const r: any = rows[0];
    if (!r) throw new NotFoundException("Recipe not found");

    const legacyNutrition = parseArray(r.nutrition);
    const nutritionTable =
      this.parseNutritionTableJson(r.nutrition_table_json) ?? {
        headers: ["Nutriment", "Pour 100ml", "Par portion"],
        rows: this.nutritionRowsFromLegacy(legacyNutrition),
      };

    const ingredients = parseArray(r.ingredients);
    const steps = parseArray(r.steps);
    const prepTime =
      r.prep_time != null && String(r.prep_time).trim() !== "" ? String(r.prep_time).trim() : "";

    const relatedProductSlug =
      r.related_product_slug != null && String(r.related_product_slug).trim() !== ""
        ? String(r.related_product_slug).trim()
        : "";

    return {
      slug: r.slug,
      title: r.title,
      category: r.category,
      summary: r.summary,
      prepTime,
      servings: Number(r.servings),
      image: r.image ?? "",
      ingredients,
      steps,
      tips: parseArray(r.tips),
      nutrition: legacyNutrition,
      nutritionTable,
      relatedProductSlug,
      isPublished: !!r.is_published,
    };
  }

  async save(body: Record<string, unknown>, id?: string) {
    await this.ensureNutritionTableColumn();
    await this.ensureRelatedProductSlugColumn();

    const nutritionTable = this.normalizeNutritionTable(body.nutritionTable);
    const legacyNutrition = arr(body.nutrition);
    const nutritionForStorage = legacyNutrition.length ? legacyNutrition : this.legacyNutritionFromTable(nutritionTable);

    const relatedProductSlugRaw = strField(body, "relatedProductSlug", "related_product_slug");
    const related_product_slug = relatedProductSlugRaw || null;

    const payload = {
      slug: str(body.slug),
      title: str(body.title),
      category: str(body.category),
      summary: str(body.summary),
      prep_time: strField(body, "prepTime", "prep_time"),
      servings: Number(body.servings ?? 1) || 1,
      image: str(body.image) || null,
      related_product_slug,
      ingredients: JSON.stringify(arr(body.ingredients)),
      steps: JSON.stringify(arr(body.steps)),
      tips: JSON.stringify(arr(body.tips)),
      nutrition: JSON.stringify(nutritionForStorage),
      nutrition_table_json: nutritionTable ? JSON.stringify(nutritionTable) : null,
      is_published: boolField(body, "isPublished", "is_published") ? 1 : 0,
    };

    if (id) {
      const [res] = await this.db.execute<ResultSetHeader>(
        "UPDATE recipes SET slug=?, title=?, category=?, summary=?, prep_time=?, servings=?, image=?, related_product_slug=?, ingredients=?, steps=?, tips=?, nutrition=?, nutrition_table_json=?, is_published=? WHERE id=?",
        [payload.slug,payload.title,payload.category,payload.summary,payload.prep_time,payload.servings,payload.image,payload.related_product_slug,payload.ingredients,payload.steps,payload.tips,payload.nutrition,payload.nutrition_table_json,payload.is_published,id],
      );
      if (!res.affectedRows) throw new NotFoundException("Recipe not found");
      return { id };
    }

    const [res] = await this.db.execute<ResultSetHeader>(
      "INSERT INTO recipes (slug, title, category, summary, prep_time, servings, image, related_product_slug, ingredients, steps, tips, nutrition, nutrition_table_json, is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [payload.slug,payload.title,payload.category,payload.summary,payload.prep_time,payload.servings,payload.image,payload.related_product_slug,payload.ingredients,payload.steps,payload.tips,payload.nutrition,payload.nutrition_table_json,payload.is_published],
    );
    return { id: String(res.insertId) };
  }

  async setPublished(id: string, isPublished: boolean) {
    const [res] = await this.db.execute<ResultSetHeader>("UPDATE recipes SET is_published = ? WHERE id = ?", [isPublished ? 1 : 0, id]);
    if (!res.affectedRows) throw new NotFoundException("Recipe not found");
    return { success: true };
  }

  async delete(id: string) {
    const [res] = await this.db.execute<ResultSetHeader>("DELETE FROM recipes WHERE id = ?", [id]);
    if (!res.affectedRows) throw new NotFoundException("Recipe not found");
    return { success: true };
  }
}
