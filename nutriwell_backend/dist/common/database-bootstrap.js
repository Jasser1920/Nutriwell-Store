"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDatabaseReady = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const promise_1 = require("mysql2/promise");
const loadLocalEnv = () => {
    const envPath = (0, path_1.join)(process.cwd(), ".env");
    if (!fs_1.default.existsSync(envPath))
        return;
    const lines = fs_1.default.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        if (!line || line.trim().startsWith("#") || !line.includes("="))
            continue;
        const idx = line.indexOf("=");
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (!(key in process.env))
            process.env[key] = value;
    }
};
const quoteIdentifier = (value) => `\`${value.replace(/`/g, "``")}\``;
const ensureDatabaseReady = async () => {
    loadLocalEnv();
    const dbName = process.env.DB_NAME ?? "nutriwell";
    const schemaPath = (0, path_1.join)(process.cwd(), "mysql-schema.sql");
    const schemaSql = fs_1.default
        .readFileSync(schemaPath, "utf8")
        .replace(/^CREATE DATABASE IF NOT EXISTS .*?;$/m, `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(dbName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
        .replace(/^USE .*?;$/m, `USE ${quoteIdentifier(dbName)};`);
    const conn = await (0, promise_1.createConnection)({
        host: process.env.DB_HOST ?? "127.0.0.1",
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER ?? "root",
        password: process.env.DB_PASSWORD ?? "",
        multipleStatements: true,
    });
    try {
        const [databaseRows] = await conn.query("SHOW DATABASES LIKE ?", [dbName]);
        if (!databaseRows.length) {
            await conn.query(`CREATE DATABASE ${quoteIdentifier(dbName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        }
        await conn.query(`USE ${quoteIdentifier(dbName)}`);
        const [tableRows] = await conn.query("SHOW TABLES LIKE 'admin_users'");
        if (!tableRows.length) {
            await conn.query(schemaSql);
        }
    }
    finally {
        await conn.end();
    }
};
exports.ensureDatabaseReady = ensureDatabaseReady;
//# sourceMappingURL=database-bootstrap.js.map