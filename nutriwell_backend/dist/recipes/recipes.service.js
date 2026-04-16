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
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../common/mysql.service");
const str = (v) => (typeof v === "string" ? v.trim() : "");
const arr = (v) => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : []);
const parseArray = (raw) => {
    if (Array.isArray(raw))
        return raw;
    if (typeof raw !== "string")
        return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
};
let RecipesService = class RecipesService {
    constructor(db) {
        this.db = db;
    }
    normalizeNutritionTable(raw) {
        if (!raw || typeof raw !== "object")
            return null;
        const table = raw;
        const headers = Array.isArray(table.headers)
            ? table.headers.map((header, index) => str(header) || `Colonne ${index + 1}`).filter(Boolean)
            : [];
        const rows = Array.isArray(table.rows)
            ? table.rows.map((row) => (Array.isArray(row) ? row.map((cell) => str(cell)) : []))
            : [];
        if (!headers.length)
            return null;
        const normalizedRows = rows
            .map((row) => Array.from({ length: headers.length }, (_, index) => row[index] ?? ""))
            .filter((row) => row.some((cell) => cell.length > 0));
        return {
            headers,
            rows: normalizedRows,
        };
    }
    parseNutritionTableJson(raw) {
        if (!raw || typeof raw !== "string")
            return null;
        try {
            return this.normalizeNutritionTable(JSON.parse(raw));
        }
        catch {
            return null;
        }
    }
    nutritionRowsFromLegacy(raw) {
        return raw
            .map((line) => {
            const match = line.match(/^([^:]+):\s*(.+?)\s*\/\s*(.+)$/);
            if (!match)
                return [line.trim(), "", ""];
            return [match[1].trim(), match[2].trim(), match[3].trim()];
        })
            .filter((row) => row.some((cell) => cell.length > 0));
    }
    legacyNutritionFromTable(table) {
        if (!table)
            return [];
        return table.rows
            .map((row) => {
            const nutriment = row[0] ?? "";
            const per100ml = row[1] ?? "";
            const perPortion = row[2] ?? "";
            if (!nutriment && !per100ml && !perPortion)
                return "";
            return `${nutriment}: ${per100ml} / ${perPortion}`.trim();
        })
            .filter(Boolean);
    }
    async ensureNutritionTableColumn() {
        const [rows] = await this.db.query(`SELECT COUNT(*) AS c
       FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = 'recipes' AND column_name = 'nutrition_table_json'`);
        const count = Number(rows[0]?.c ?? 0);
        if (count > 0)
            return;
        await this.db.execute("ALTER TABLE recipes ADD COLUMN nutrition_table_json LONGTEXT NULL");
    }
    async listPublic(query) {
        const where = ["is_published = 1"];
        const params = [];
        if (str(query.category) && str(query.category) !== "Toutes") {
            where.push("category = ?");
            params.push(str(query.category));
        }
        const [rows] = await this.db.query(`SELECT id, slug, title, category, summary, prep_time, servings, image, is_published, updated_at FROM recipes WHERE ${where.join(" AND ")} ORDER BY updated_at DESC`, params);
        return rows.map((r) => ({ ...r, id: String(r.id), is_published: !!r.is_published }));
    }
    async getPublicBySlug(slug) {
        await this.ensureNutritionTableColumn();
        const [rows] = await this.db.query("SELECT * FROM recipes WHERE slug = ? AND is_published = 1 LIMIT 1", [slug]);
        const r = rows[0];
        if (!r)
            return null;
        const legacyNutrition = parseArray(r.nutrition);
        const nutritionTable = this.parseNutritionTableJson(r.nutrition_table_json) ?? {
            headers: ["Nutriment", "Pour 100ml", "Par portion"],
            rows: this.nutritionRowsFromLegacy(legacyNutrition),
        };
        return {
            id: String(r.id),
            slug: r.slug,
            title: r.title,
            category: r.category,
            summary: r.summary,
            prepTime: r.prep_time,
            servings: Number(r.servings),
            image: r.image ?? "",
            ingredients: parseArray(r.ingredients),
            steps: parseArray(r.steps),
            tips: parseArray(r.tips),
            nutrition: legacyNutrition,
            nutritionTable,
        };
    }
    async listAdmin() {
        const [rows] = await this.db.query("SELECT id, slug, title, category, summary, prep_time, servings, image, is_published, updated_at FROM recipes ORDER BY updated_at DESC");
        return rows.map((r) => ({ ...r, id: String(r.id), is_published: !!r.is_published }));
    }
    async getAdminById(id) {
        await this.ensureNutritionTableColumn();
        const [rows] = await this.db.query("SELECT * FROM recipes WHERE id = ? LIMIT 1", [id]);
        const r = rows[0];
        if (!r)
            throw new common_1.NotFoundException("Recipe not found");
        const legacyNutrition = parseArray(r.nutrition);
        const nutritionTable = this.parseNutritionTableJson(r.nutrition_table_json) ?? {
            headers: ["Nutriment", "Pour 100ml", "Par portion"],
            rows: this.nutritionRowsFromLegacy(legacyNutrition),
        };
        return {
            slug: r.slug,
            title: r.title,
            category: r.category,
            summary: r.summary,
            prepTime: r.prep_time,
            servings: Number(r.servings),
            image: r.image ?? "",
            ingredients: parseArray(r.ingredients),
            steps: parseArray(r.steps),
            tips: parseArray(r.tips),
            nutrition: legacyNutrition,
            nutritionTable,
            isPublished: !!r.is_published,
        };
    }
    async save(body, id) {
        await this.ensureNutritionTableColumn();
        const nutritionTable = this.normalizeNutritionTable(body.nutritionTable);
        const legacyNutrition = arr(body.nutrition);
        const nutritionForStorage = legacyNutrition.length ? legacyNutrition : this.legacyNutritionFromTable(nutritionTable);
        const payload = {
            slug: str(body.slug),
            title: str(body.title),
            category: str(body.category),
            summary: str(body.summary),
            prep_time: str(body.prepTime),
            servings: Number(body.servings ?? 1) || 1,
            image: str(body.image) || null,
            ingredients: JSON.stringify(arr(body.ingredients)),
            steps: JSON.stringify(arr(body.steps)),
            tips: JSON.stringify(arr(body.tips)),
            nutrition: JSON.stringify(nutritionForStorage),
            nutrition_table_json: nutritionTable ? JSON.stringify(nutritionTable) : null,
            is_published: body.isPublished ? 1 : 0,
        };
        if (id) {
            const [res] = await this.db.execute("UPDATE recipes SET slug=?, title=?, category=?, summary=?, prep_time=?, servings=?, image=?, ingredients=?, steps=?, tips=?, nutrition=?, nutrition_table_json=?, is_published=? WHERE id=?", [payload.slug, payload.title, payload.category, payload.summary, payload.prep_time, payload.servings, payload.image, payload.ingredients, payload.steps, payload.tips, payload.nutrition, payload.nutrition_table_json, payload.is_published, id]);
            if (!res.affectedRows)
                throw new common_1.NotFoundException("Recipe not found");
            return { id };
        }
        const [res] = await this.db.execute("INSERT INTO recipes (slug, title, category, summary, prep_time, servings, image, ingredients, steps, tips, nutrition, nutrition_table_json, is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [payload.slug, payload.title, payload.category, payload.summary, payload.prep_time, payload.servings, payload.image, payload.ingredients, payload.steps, payload.tips, payload.nutrition, payload.nutrition_table_json, payload.is_published]);
        return { id: String(res.insertId) };
    }
    async setPublished(id, isPublished) {
        const [res] = await this.db.execute("UPDATE recipes SET is_published = ? WHERE id = ?", [isPublished ? 1 : 0, id]);
        if (!res.affectedRows)
            throw new common_1.NotFoundException("Recipe not found");
        return { success: true };
    }
    async delete(id) {
        const [res] = await this.db.execute("DELETE FROM recipes WHERE id = ?", [id]);
        if (!res.affectedRows)
            throw new common_1.NotFoundException("Recipe not found");
        return { success: true };
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map