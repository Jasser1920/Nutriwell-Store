import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MysqlService } from "../common/mysql.service";

const DELIVERY_FEE = 5;

type CreateOrderItemInput = {
  productId?: number | string;
  productSlug?: string;
  productName: string;
  flavor?: string;
  format?: string;
  unitPriceTtc: number;
  quantity: number;
};

type CreateOrderInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  items: CreateOrderItemInput[];
};

@Injectable()
export class OrdersService {
  constructor(private readonly db: MysqlService) {}

  private generateOrderRef(): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `NW-${today}-${random}`;
  }

  async ensureOrdersTables() {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        order_reference VARCHAR(64) NOT NULL,
        first_name VARCHAR(191) NOT NULL,
        last_name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        address VARCHAR(255) NOT NULL,
        postal_code VARCHAR(32) DEFAULT NULL,
        city VARCHAR(191) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        status ENUM('en_attente', 'acceptee', 'refusee') NOT NULL DEFAULT 'en_attente',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_orders_ref (order_reference)
      ) ENGINE=InnoDB
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        order_id BIGINT UNSIGNED NOT NULL,
        product_id BIGINT UNSIGNED DEFAULT NULL,
        product_name VARCHAR(191) NOT NULL,
        product_slug VARCHAR(191) DEFAULT NULL,
        flavor VARCHAR(191) DEFAULT NULL,
        format VARCHAR(191) DEFAULT NULL,
        unit_price_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        quantity INT NOT NULL DEFAULT 1,
        total_price_ttc DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        PRIMARY KEY (id),
        KEY idx_oi_order (order_id),
        CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  async createOrder(body: CreateOrderInput) {
    await this.ensureOrdersTables();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const postalCode = String(body.postalCode ?? "").trim();
    const city = String(body.city ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!firstName || !lastName || !email || !phone || !address) {
      throw new BadRequestException("Veuillez remplir tous les champs obligatoires (nom, prénom, email, téléphone, adresse).");
    }

    if (items.length === 0) {
      throw new BadRequestException("Votre panier est vide.");
    }

    let calculatedTotal = DELIVERY_FEE;
    const validatedItems = items.map((item) => {
      const productName = String(item.productName ?? "Produit").trim();
      const productSlug = item.productSlug ? String(item.productSlug).trim() : null;
      const productId = item.productId ? Number(item.productId) : null;
      const flavor = item.flavor ? String(item.flavor).trim() : null;
      const format = item.format ? String(item.format).trim() : null;
      const unitPriceTtc = Number(item.unitPriceTtc ?? 0);
      const quantity = Math.max(1, Number(item.quantity ?? 1));
      const totalPriceTtc = unitPriceTtc * quantity;

      calculatedTotal += totalPriceTtc;

      return {
        productId,
        productSlug,
        productName,
        flavor,
        format,
        unitPriceTtc,
        quantity,
        totalPriceTtc,
      };
    });

    const orderRef = this.generateOrderRef();

    let orderId = 0;
    await this.db.transaction(async (conn) => {
      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO orders (order_reference, first_name, last_name, email, phone, address, postal_code, city, notes, total_ttc, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
        [orderRef, firstName, lastName, email, phone, address, postalCode || null, city || null, notes || null, calculatedTotal],
      );
      orderId = res.insertId;

      for (const item of validatedItems) {
        await conn.execute(
          `INSERT INTO order_items (order_id, product_id, product_slug, product_name, flavor, format, unit_price_ttc, quantity, total_price_ttc)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.productId,
            item.productSlug,
            item.productName,
            item.flavor,
            item.format,
            item.unitPriceTtc,
            item.quantity,
            item.totalPriceTtc,
          ],
        );
      }
    });

    return {
      success: true,
      orderReference: orderRef,
      totalTtc: calculatedTotal,
      message: "Votre commande a été enregistrée avec succès. Elle est en cours de validation par notre équipe.",
    };
  }

  async getOrderByReference(ref: string) {
    await this.ensureOrdersTables();

    const [rows] = await this.db.query<RowDataPacket[]>(
      `SELECT * FROM orders WHERE order_reference = ? LIMIT 1`,
      [ref],
    );
    const order: any = rows[0];
    if (!order) throw new NotFoundException("Commande non trouvée");

    const [items] = await this.db.query<RowDataPacket[]>(
      `SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC`,
      [order.id],
    );

    return {
      id: String(order.id),
      orderReference: order.order_reference,
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      postalCode: order.postal_code,
      city: order.city,
      notes: order.notes,
      totalTtc: Number(order.total_ttc),
      status: order.status,
      createdAt: order.created_at,
      items: (items as any[]).map((i) => ({
        id: String(i.id),
        productName: i.product_name,
        productSlug: i.product_slug,
        flavor: i.flavor,
        format: i.format,
        unitPriceTtc: Number(i.unit_price_ttc),
        quantity: Number(i.quantity),
        totalPriceTtc: Number(i.total_price_ttc),
      })),
    };
  }

  async listAdminOrders(statusFilter?: string) {
    await this.ensureOrdersTables();

    let whereClause = "";
    const params: any[] = [];
    if (statusFilter && statusFilter !== "all") {
      whereClause = "WHERE status = ?";
      params.push(statusFilter);
    }

    const [orders] = await this.db.query<RowDataPacket[]>(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC`,
      params,
    );

    const result = [];
    for (const order of orders as any[]) {
      const [items] = await this.db.query<RowDataPacket[]>(
        `SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC`,
        [order.id],
      );
      result.push({
        id: String(order.id),
        orderReference: order.order_reference,
        firstName: order.first_name,
        lastName: order.last_name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        postalCode: order.postal_code,
        city: order.city,
        notes: order.notes,
        totalTtc: Number(order.total_ttc),
        status: order.status,
        createdAt: order.created_at,
        itemsCount: (items as any[]).length,
        items: (items as any[]).map((i) => ({
          id: String(i.id),
          productName: i.product_name,
          productSlug: i.product_slug,
          flavor: i.flavor,
          format: i.format,
          unitPriceTtc: Number(i.unit_price_ttc),
          quantity: Number(i.quantity),
          totalPriceTtc: Number(i.total_price_ttc),
        })),
      });
    }

    return result;
  }

  async updateOrderStatus(id: string, status: "en_attente" | "acceptee" | "refusee") {
    await this.ensureOrdersTables();

    if (!["en_attente", "acceptee", "refusee"].includes(status)) {
      throw new BadRequestException("Statut invalide.");
    }

    const [res] = await this.db.execute<ResultSetHeader>(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id],
    );

    if (!res.affectedRows) throw new NotFoundException("Commande non trouvée");

    return { success: true, status };
  }

  async deleteOrder(id: string) {
    await this.ensureOrdersTables();

    const [res] = await this.db.execute<ResultSetHeader>(
      `DELETE FROM orders WHERE id = ?`,
      [id],
    );

    if (!res.affectedRows) throw new NotFoundException("Commande non trouvée");

    return { success: true };
  }
}
