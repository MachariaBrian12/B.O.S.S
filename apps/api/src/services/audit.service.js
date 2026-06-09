const { prisma } = require('../lib/prisma');

/**
 * AuditService — write-once, read-many paper trail.
 *
 * Analogy: a bank teller who fills in a slip for every
 * transaction. The teller doesn't decide whether the
 * transaction is important — every single one gets a slip.
 * That's the rule. Same here: every write operation in
 * B.O.S.S calls logAction(), no exceptions.
 *
 * Usage:
 *   await AuditService.logAction(req, 'entry.created', 'BusinessEntry', entry.id, { sales, expenses });
 */
const AuditService = {
  async logAction(req, action, resourceType, resourceId = null, metadata = null) {
    try {
      await prisma.auditLog.create({
        data: {
          actorId:      req.user.id,
          action,
          resourceType,
          resourceId:   resourceId ? String(resourceId) : null,
          metadata,
          ip:           req.ip || req.headers['x-forwarded-for'] || null,
          userAgent:    req.headers['user-agent'] || null,
        },
      });
    } catch (err) {
      // Audit log failure must NEVER crash the main request.
      // Like a teller forgetting to fill in the slip —
      // the transaction still goes through, but we log the miss.
      console.error('[AuditService] Failed to write audit log:', err.message);
    }
  },

  async getLogsForUser(userId, limit = 50) {
    return prisma.auditLog.findMany({
      where:   { actorId: userId },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  },

  async getAllLogs(limit = 100) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take:    limit,
      include: { actor: { select: { id: true, name: true, email: true } } },
    });
  },
};

module.exports = { AuditService };
