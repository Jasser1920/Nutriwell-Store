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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../common/mysql.service");
const str = (v) => (typeof v === "string" ? v.trim() : "");
const arr = (v) => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : []);
let ProductsService = class ProductsService {
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
    async ensureNutritionTableColumn() {
        const [rows] = await this.db.query(`SELECT COUNT(*) AS c
       FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = 'products' AND column_name = 'nutrition_table_json'`);
        const count = Number(rows[0]?.c ?? 0);
        if (count > 0)
            return;
        await this.db.execute("ALTER TABLE products ADD COLUMN nutrition_table_json LONGTEXT NULL");
    }
    async listPublic(query) {
        const where = ["is_published = 1"];
        const params = [];
        if (str(query.texture)) {
            where.push("texture = ?");
            params.push(str(query.texture));
        }
        if (str(query.gout)) {
            where.push("gout = ?");
            params.push(str(query.gout));
        }
        if (str(query.regime)) {
            where.push("regime = ?");
            params.push(str(query.regime));
        }
        if (str(query.excludeSlug)) {
            where.push("slug <> ?");
            params.push(str(query.excludeSlug));
        }
        const limit = Number(query.limit ?? 24);
        const [rows] = await this.db.query(`SELECT id, slug, name, image, texture, gout, regime, badge, badge_color FROM products WHERE ${where.join(" AND ")} ORDER BY name ASC LIMIT ${Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 40) : 24}`, params);
        const ids = rows.map((r) => Number(r.id));
        const counts = new Map();
        if (ids.length) {
            const placeholders = ids.map(() => "?").join(",");
            const [flavorRows] = await this.db.query(`SELECT product_id, COUNT(*) as c FROM product_flavors WHERE product_id IN (${placeholders}) GROUP BY product_id`, ids);
            for (const row of flavorRows)
                counts.set(Number(row.product_id), Number(row.c));
        }
        const asArray = !!str(query.excludeSlug) || Number(query.limit ?? 0) > 0;
        return rows.map((r) => {
            const c = counts.get(Number(r.id)) ?? 0;
            const label = c <= 1 ? "1 saveur" : `${c} saveurs`;
            return {
                slug: r.slug,
                name: r.name,
                image: r.image ?? "",
                texture: r.texture,
                gout: r.gout,
                regime: r.regime,
                badge: r.badge ?? undefined,
                badgeColor: r.badge_color ?? undefined,
                ...(asArray ? { flavors: Array.from({ length: c }, (_, i) => `saveur-${i + 1}`) } : { flavors: label, flavorsLabel: label }),
            };
        });
    }
    async getPublicBySlug(slug) {
        await this.ensureNutritionTableColumn();
        const [rows] = await this.db.query("SELECT id, slug, name, category, short_description, texture, gout, regime, badge, badge_color, image, rating, review_count, nutrition_table_json FROM products WHERE slug = ? AND is_published = 1 LIMIT 1", [slug]);
        const p = rows[0];
        if (!p)
            return null;
        return this.buildFullProduct(p);
    }
    async listAdmin() {
        const [rows] = await this.db.query("SELECT id, slug, name, category, texture, gout, regime, is_published, updated_at FROM products ORDER BY updated_at DESC");
        return rows.map((r) => ({ ...r, id: String(r.id), is_published: !!r.is_published }));
    }
    async getAdminById(id) {
        await this.ensureNutritionTableColumn();
        const [rows] = await this.db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
        const p = rows[0];
        if (!p)
            throw new common_1.NotFoundException("Product not found");
        const full = await this.buildFullProduct(p);
        return {
            slug: full.slug,
            name: full.name,
            category: full.category,
            shortDescription: full.shortDescription,
            texture: full.texture,
            gout: full.gout,
            regime: full.regime,
            badge: full.badge ?? "",
            badgeColor: full.badgeColor ?? "",
            image: full.image,
            rating: full.rating,
            reviewCount: full.reviewCount,
            isPublished: !!p.is_published,
            descriptions: full.description,
            benefits: full.benefits,
            flavors: full.flavors,
            formats: full.formats,
            nutrition: full.nutrition,
            usageTips: full.usageTips,
            images: full.images,
            reviews: full.reviews,
        };
    }
    async save(body, id) {
        await this.ensureNutritionTableColumn();
        const nutritionTable = this.normalizeNutritionTable(body.nutritionTable);
        const payload = {
            slug: str(body.slug),
            name: str(body.name),
            category: str(body.category),
            short_description: str(body.shortDescription),
            texture: str(body.texture),
            gout: str(body.gout),
            regime: str(body.regime),
            badge: str(body.badge) || null,
            badge_color: str(body.badgeColor) || null,
            image: str(body.image) || null,
            rating: Number(body.rating ?? 0) || 0,
            review_count: Number(body.reviewCount ?? 0) || 0,
            is_published: body.isPublished ? 1 : 0,
            nutrition_table_json: nutritionTable ? JSON.stringify(nutritionTable) : null,
        };
        let productId = id;
        if (id) {
            const [res] = await this.db.execute("UPDATE products SET slug=?,name=?,category=?,short_description=?,texture=?,gout=?,regime=?,badge=?,badge_color=?,image=?,rating=?,review_count=?,is_published=?,nutrition_table_json=? WHERE id=?", [payload.slug, payload.name, payload.category, payload.short_description, payload.texture, payload.gout, payload.regime, payload.badge, payload.badge_color, payload.image, payload.rating, payload.review_count, payload.is_published, payload.nutrition_table_json, id]);
            if (!res.affectedRows)
                throw new common_1.NotFoundException("Product not found");
        }
        else {
            const [res] = await this.db.execute("INSERT INTO products (slug,name,category,short_description,texture,gout,regime,badge,badge_color,image,rating,review_count,is_published,nutrition_table_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [payload.slug, payload.name, payload.category, payload.short_description, payload.texture, payload.gout, payload.regime, payload.badge, payload.badge_color, payload.image, payload.rating, payload.review_count, payload.is_published, payload.nutrition_table_json]);
            productId = String(res.insertId);
        }
        await this.replaceChildren(productId, body);
        return { id: productId };
    }
    async setPublished(id, isPublished) {
        const [res] = await this.db.execute("UPDATE products SET is_published = ? WHERE id = ?", [isPublished ? 1 : 0, id]);
        if (!res.affectedRows)
            throw new common_1.NotFoundException("Product not found");
        return { success: true };
    }
    async delete(id) {
        const [res] = await this.db.execute("DELETE FROM products WHERE id = ?", [id]);
        if (!res.affectedRows)
            throw new common_1.NotFoundException("Product not found");
        return { success: true };
    }
    async replaceChildren(productId, body) {
        const tables = [
            "product_descriptions",
            "product_benefits",
            "product_flavors",
            "product_formats",
            "product_nutrition",
            "product_usage_tips",
            "product_images",
            "product_reviews",
            "product_ingredients",
            "product_important_notices"
        ];
        await this.db.transaction(async (conn) => {
            for (const table of tables)
                await conn.execute(`DELETE FROM ${table} WHERE product_id = ?`, [productId]);
            const descriptions = arr(body.descriptions);
            for (const [i, content] of descriptions.entries())
                await conn.execute("INSERT INTO product_descriptions (product_id, content, sort_order) VALUES (?, ?, ?)", [productId, content, i]);
            const benefits = arr(body.benefits);
            for (const [i, content] of benefits.entries())
                await conn.execute("INSERT INTO product_benefits (product_id, content, sort_order) VALUES (?, ?, ?)", [productId, content, i]);
            const flavors = arr(body.flavors);
            for (const [i, name] of flavors.entries())
                await conn.execute("INSERT INTO product_flavors (product_id, name, sort_order) VALUES (?, ?, ?)", [productId, name, i]);
            const formats = arr(body.formats);
            for (const [i, label] of formats.entries())
                await conn.execute("INSERT INTO product_formats (product_id, label, sort_order) VALUES (?, ?, ?)", [productId, label, i]);
            const ingredients = arr(body.ingredients);
            for (const [i, content] of ingredients.entries())
                await conn.execute("INSERT INTO product_ingredients (product_id, content, sort_order) VALUES (?, ?, ?)", [productId, content, i]);
            const importantNotices = arr(body.importantNotice);
            for (const [i, content] of importantNotices.entries())
                await conn.execute("INSERT INTO product_important_notices (product_id, content, sort_order) VALUES (?, ?, ?)", [productId, content, i]);
            const nutritionTable = this.normalizeNutritionTable(body.nutritionTable);
            const nutritionFromTable = (nutritionTable?.rows ?? []).map((row) => ({
                nutriment: row[0] ?? "",
                per100ml: row[1] ?? "",
                perPortion: row[2] ?? "",
            }));
            const nutritionSource = nutritionFromTable.some((row) => row.nutriment || row.per100ml || row.perPortion)
                ? nutritionFromTable
                : Array.isArray(body.nutrition)
                    ? body.nutrition
                    : [];
            const nutrition = Array.isArray(nutritionSource) ? nutritionSource : [];
            for (const [i, n] of nutrition.entries()) {
                const row = n;
                if (!str(row.nutriment) && !str(row.per100ml) && !str(row.perPortion))
                    continue;
                await conn.execute("INSERT INTO product_nutrition (product_id, nutriment, per_100ml, per_portion, sort_order) VALUES (?, ?, ?, ?, ?)", [productId, str(row.nutriment), str(row.per100ml), str(row.perPortion), i]);
            }
            const usageTips = Array.isArray(body.usageTips) ? body.usageTips : [];
            for (const [i, u] of usageTips.entries()) {
                const row = u;
                if (!str(row.text) || !str(row.icon))
                    continue;
                await conn.execute("INSERT INTO product_usage_tips (product_id, icon, content, sort_order) VALUES (?, ?, ?, ?)", [productId, str(row.icon), str(row.text), i]);
            }
            const images = arr(body.images);
            for (const [i, image] of images.entries())
                await conn.execute("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)", [productId, image, i]);
            const reviews = Array.isArray(body.reviews) ? body.reviews : [];
            for (const [i, r] of reviews.entries()) {
                const row = r;
                if (!str(row.name) || !str(row.text) || Number(row.rating) < 1)
                    continue;
                await conn.execute("INSERT INTO product_reviews (product_id, reviewer_name, rating, review_text, review_date, sort_order) VALUES (?, ?, ?, ?, ?, ?)", [productId, str(row.name), Number(row.rating), str(row.text), str(row.date) || null, i]);
            }
        });
    }
    async buildFullProduct(p) {
        await this.ensureNutritionTableColumn();
        const id = p.id;
        const [d, b, f, fo, n, u, i, r, ing, notices] = await Promise.all([
            this.db.query("SELECT content FROM product_descriptions WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT content FROM product_benefits WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT name FROM product_flavors WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT label FROM product_formats WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT nutriment, per_100ml, per_portion FROM product_nutrition WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT icon, content FROM product_usage_tips WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT reviewer_name, rating, review_text, review_date FROM product_reviews WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT content FROM product_ingredients WHERE product_id = ? ORDER BY sort_order ASC", [id]),
            this.db.query("SELECT content FROM product_important_notices WHERE product_id = ? ORDER BY sort_order ASC", [id]),
        ]);
        const imgs = i[0].map((x) => x.image_url).filter(Boolean);
        const legacyNutrition = n[0].map((x) => ({ nutriment: x.nutriment, per100ml: x.per_100ml, perPortion: x.per_portion }));
        const parsedNutritionTable = this.parseNutritionTableJson(p.nutrition_table_json);
        const nutritionTable = parsedNutritionTable ?? {
            headers: ["Nutriment", "Pour 100ml", "Par portion"],
            rows: legacyNutrition.map((row) => [row.nutriment ?? "", row.per100ml ?? "", row.perPortion ?? ""]),
        };
        return {
            slug: p.slug,
            name: p.name,
            category: p.category,
            flavors: f[0].map((x) => x.name),
            formats: fo[0].map((x) => x.label),
            badge: p.badge ?? undefined,
            badgeColor: p.badge_color ?? undefined,
            image: p.image ?? imgs[0] ?? "",
            images: imgs.length ? imgs : [p.image ?? ""],
            rating: Number(p.rating ?? 0),
            reviewCount: Number(p.review_count ?? 0),
            shortDescription: p.short_description,
            description: d[0].map((x) => x.content),
            benefits: b[0].map((x) => x.content),
            ingredients: ing[0].map((x) => x.content),
            importantNotice: notices[0].map((x) => x.content),
            nutrition: legacyNutrition,
            nutritionTable,
            usageTips: u[0].map((x) => ({ icon: x.icon, text: x.content })),
            reviews: r[0].map((x) => ({ name: x.reviewer_name, rating: x.rating, text: x.review_text, date: x.review_date ? new Date(x.review_date).toISOString().slice(0, 10) : "" })),
            texture: p.texture,
            gout: p.gout,
            regime: p.regime,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService])
], ProductsService);
//# sourceMappingURL=products.service.js.map