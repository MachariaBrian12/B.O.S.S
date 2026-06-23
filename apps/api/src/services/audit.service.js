/**
 * AuditService — currently a no-op stub.
 *
 * The AuditLog table exists in the Prisma schema but not in the
 * live Postgres database yet. Until the schema is aligned, all
 * audit log calls are silently swallowed so they never crash
 * the server. Replace this with real Prisma writes once the
 * live schema includes the AuditLog table.
 */

const AuditService = {
  logAction: (req, action, resourceType, resourceId, metadata) => {
    // Fire-and-forget stub — logs to console only until DB table exists
    console.log('[Audit]', {
      action,
      resourceType,
      resourceId,
      userId: req?.user?.id,
      ip: req?.ip,
    });
  },
};

module.exports = { AuditService };
