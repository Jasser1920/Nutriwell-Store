import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { createPool, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

@Injectable()
export class MysqlService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "nutriwell",
      waitForConnections: true,
      connectionLimit: 10,
      decimalNumbers: true,
    });
  }

  query<T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]>(sql: string, params: any[] = []) {
    return this.pool.query<T>(sql, params);
  }

  execute<T extends ResultSetHeader = ResultSetHeader>(sql: string, params: any[] = []) {
    return this.pool.execute<T>(sql, params);
  }

  async transaction<T>(runner: (conn: PoolConnection) => Promise<T>) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await runner(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
