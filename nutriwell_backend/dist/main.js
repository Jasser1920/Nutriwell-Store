"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const auth_service_1 = require("./auth/auth.service");
const database_bootstrap_1 = require("./common/database-bootstrap");
const parseAllowedOrigins = () => {
    const raw = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173,http://localhost:8080";
    const origins = raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    return origins.length ? origins : ["http://localhost:5173", "http://localhost:8080"];
};
async function bootstrap() {
    await (0, database_bootstrap_1.ensureDatabaseReady)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const authService = app.get(auth_service_1.AuthService);
    await authService.ensureAdmin();
    const allowedOrigins = parseAllowedOrigins();
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_1.json)({ limit: "10mb" }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: "10mb" }));
    app.useStaticAssets((0, path_1.join)(process.cwd(), "uploads"), { prefix: "/uploads/" });
    await app.listen(Number(process.env.PORT ?? 3001));
}
void bootstrap();
//# sourceMappingURL=main.js.map