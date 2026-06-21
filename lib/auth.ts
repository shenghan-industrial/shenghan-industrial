import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

// ── RBAC Roles ──────────────────────────────────────────────
export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface AdminPayload {
  username: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}

export const ROLES: Record<AdminRole, { level: number; label: string }> = {
  SUPER_ADMIN: { level: 3, label: "超级管理员" },
  ADMIN: { level: 2, label: "管理员" },
  EDITOR: { level: 1, label: "编辑" },
};

/** Permission matrix — which role can do what */
export const PERMISSIONS: Record<string, AdminRole[]> = {
  "product:create": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "product:edit": ["SUPER_ADMIN", "ADMIN"],
  "product:delete": ["SUPER_ADMIN"],
  "category:manage": ["SUPER_ADMIN", "ADMIN"],
  "site:edit": ["SUPER_ADMIN", "ADMIN"],
  "inquiry:view": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "inquiry:manage": ["SUPER_ADMIN", "ADMIN"],
};

export function hasPermission(role: AdminRole, permission: string): boolean {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(role);
}

// ── JWT helpers ─────────────────────────────────────────────
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Development: allow default for local dev convenience
    if (process.env.NODE_ENV === "development") {
      return new TextEncoder().encode("shenghan-dev-jwt-secret");
    }
    throw new Error(
      "FATAL: JWT_SECRET environment variable is required in production.\n" +
      "Set it in your .env.local or deployment environment variables."
    );
  }
  if (secret.length < 32) {
    throw new Error(
      "FATAL: JWT_SECRET must be at least 32 characters long.\n" +
      `Current length: ${secret.length}. Generate a secure random string.`
    );
  }
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getJWTSecret();

const COOKIE_NAME = "admin_token";
const JWT_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

export async function signJWT(payload: Omit<AdminPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

// ── Password helpers ────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Cookie helpers ──────────────────────────────────────────
export function getTokenMaxAge(): number {
  return JWT_MAX_AGE;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

// ── Admin user store (in-memory until Supabase migration) ──
export interface AdminUser {
  username: string;
  passwordHash: string;
  role: AdminRole;
}

export function getDefaultAdmins(): AdminUser[] {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!username || !passwordHash) {
    // Development: allow default admin/admin123 for local dev
    if (process.env.NODE_ENV === "development") {
      return [
        {
          username: "admin",
          passwordHash: "$2b$10$mY3K.yQdCLtiDbSYIVF1v.ksBTWpLDCkDklpCqPAnQQoxkuPqlffW",
          role: "SUPER_ADMIN",
        },
      ];
    }
    throw new Error(
      "FATAL: ADMIN_USERNAME and ADMIN_PASSWORD_HASH environment variables are required in production.\n" +
      "Set them in your deployment environment variables.\n" +
      'Generate password hash: node -e "const bcrypt = require(\'bcryptjs\'); console.log(bcrypt.hashSync(\'yourpassword\', 10));"'
    );
  }

  return [
    {
      username,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  ];
}

export function findAdminByUsername(username: string): AdminUser | undefined {
  return getDefaultAdmins().find((a) => a.username === username);
}

// ── API Route RBAC helpers ─────────────────────────────────
/**
 * Extract admin role from request headers (injected by middleware).
 * Returns null if the role header is missing or invalid.
 */
export function getRoleFromRequest(request: Request): AdminRole | null {
  const role = request.headers.get("x-admin-role");
  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR") {
    return role;
  }
  return null;
}

/**
 * Require a specific permission. Throws 401/403 Response if not authorized.
 * Returns the role if authorized.
 */
export function requirePermission(request: Request, permission: string): AdminRole {
  const role = getRoleFromRequest(request);
  if (!role) {
    throw new Error("UNAUTHORIZED: No role header");
  }
  if (!hasPermission(role, permission)) {
    throw new Error(`FORBIDDEN: ${role} lacks ${permission}`);
  }
  return role;
}
