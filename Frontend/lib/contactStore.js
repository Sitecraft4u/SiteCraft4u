const globalStore = globalThis;

if (!globalStore.__sitecraftFeedback) {
  globalStore.__sitecraftFeedback = [];
}

export function addFeedback(item) {
  globalStore.__sitecraftFeedback.unshift(item);
  return item;
}

export function listFeedback() {
  return globalStore.__sitecraftFeedback;
}
