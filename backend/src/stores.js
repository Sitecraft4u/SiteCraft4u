const globalStore = globalThis;

if (!globalStore.__sitecraftQuotes) globalStore.__sitecraftQuotes = [];
if (!globalStore.__sitecraftVisitors) globalStore.__sitecraftVisitors = [];
if (!globalStore.__sitecraftFeedback) globalStore.__sitecraftFeedback = [];

export const quotesStore = {
  add(quote) {
    globalStore.__sitecraftQuotes.unshift(quote);
    return quote;
  },
  list() {
    return globalStore.__sitecraftQuotes;
  },
};

export const visitorsStore = {
  add(visitor) {
    globalStore.__sitecraftVisitors.unshift(visitor);
    return visitor;
  },
  list() {
    return globalStore.__sitecraftVisitors;
  },
  updateContact(id, contact) {
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
  },
  hasCapturedByIp(ip) {
    if (!ip || ip === "unknown") return false;
    return globalStore.__sitecraftVisitors.some(
      (item) => item.ip === ip && item.email && item.phone
    );
  },
  getCapturedByIp(ip) {
    if (!ip || ip === "unknown") return null;
    const visitor = globalStore.__sitecraftVisitors.find(
      (item) => item.ip === ip && item.email && item.phone
    );
    if (!visitor) return null;
    return {
      email: visitor.email,
      phone: visitor.phone,
    };
  },
};

export const feedbackStore = {
  add(item) {
    globalStore.__sitecraftFeedback.unshift(item);
    return item;
  },
  list() {
    return globalStore.__sitecraftFeedback;
  },
};
