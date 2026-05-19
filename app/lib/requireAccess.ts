import { hasAccess } from "./access";
import { Level, Permission } from "./permissions";

export function requireAccess(
  level: Level | undefined,
  permission: Permission
) {
  if (!hasAccess(level, permission)) {
    throw new Error("FORBIDDEN");
  }
}