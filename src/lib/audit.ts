import prisma from "./prisma";

export async function createAuditLog(params: {
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  userId?: string;
  schoolId: string;
  ipAddress?: string;
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details as any,
      userId: params.userId,
      schoolId: params.schoolId,
      ipAddress: params.ipAddress,
    },
  });
}
