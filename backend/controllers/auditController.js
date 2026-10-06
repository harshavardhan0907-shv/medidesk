import AuditLog from '../models/AuditLog.js';
export async function recordAudit({ actor, action, resource, resourceId, req, metadata }) { try { await AuditLog.create({ actor, action, resource, resourceId, ip: req?.ip, metadata }); } catch (error) { console.error('Audit log failure:', error.message); } }
