import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function audit(
  userId: number | undefined,
  action: "CREATE" | "UPDATE" | "DELETE",
  entity: string,
  entityId?: number,
  diff?: any
) {
  // TODO: Implementar tabla de auditoria
  console.log(`[AUDIT] ${action} on ${entity} by user ${userId}`, { entityId, diff });
}