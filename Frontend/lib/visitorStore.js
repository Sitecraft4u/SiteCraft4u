const globalStore = globalThis;

if (!globalStore.__sitecraftVisitors) {
  globalStore.__sitecraftVisitors = [];
}

export function addVisitor(visitor) {
  globalStore.__sitecraftVisitors.unshift(visitor);
  return visitor;
}

export function listVisitors() {
  return globalStore.__sitecraftVisitors;
}

export function updateVisitorContact(id, contact) {
  const index = globalStore.__sitecraftVisitors.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated = {
    ...globalStore.__sitecraftVisitors[index],
    email: contact.email || globalStore.__sitecraftVisitors[index].email || "",
    phone: contact.phone || globalStore.__sitecraftVisitors[index].phone || "",
    contactCapturedAt: new Date().toISOString(),
  };

  globalStore.__sitecraftVisitors[index] = updated;
  return updated;
}

export function hasCapturedContactByIp(ip) {
  if (!ip || ip === "unknown") return false;
  return globalStore.__sitecraftVisitors.some(
    (item) => item.ip === ip && item.email && item.phone
  );
}

export function getCapturedContactByIp(ip) {
  if (!ip || ip === "unknown") return null;
  const visitor = globalStore.__sitecraftVisitors.find(
    (item) => item.ip === ip && item.email && item.phone
  );
  if (!visitor) return null;
  return {
    email: visitor.email,
    phone: visitor.phone,
  };
}
