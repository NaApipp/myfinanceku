// import { LEVEL_PERMISSIONS, Level, Permission } from "./permissions";

// export function hasAccess(role: Level, permission: Permission) {
//   return LEVEL_PERMISSIONS[role]?.includes(permission);
// }

// lib/access.ts

import { LEVEL_PERMISSIONS, Level, Permission } from "./permissions";

/**
 * Check apakah user punya akses ke suatu fitur
 */
export function hasAccess(
  level: Level | undefined,
  permission: Permission
): boolean {
  if (!level) return false;

  const permissions = LEVEL_PERMISSIONS[level];

  if (!permissions) return false;

  return (permissions as readonly Permission[]).includes(permission);
}