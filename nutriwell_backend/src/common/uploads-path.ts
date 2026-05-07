import { join } from "path";

// Stable uploads directory independent from process start cwd.
export const UPLOADS_ROOT = join(__dirname, "..", "..", "uploads");
