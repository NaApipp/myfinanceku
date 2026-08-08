// lib/cors.ts
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

export function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true", // wajib kalau pakai cookie httpOnly
    "Access-Control-Max-Age": "86400", // cache preflight 24 jam
  };
}