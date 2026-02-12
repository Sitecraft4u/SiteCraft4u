const globalStore = globalThis;

if (!globalStore.__sitecraftQuotes) {
  globalStore.__sitecraftQuotes = [];
}

export function addQuote(quote) {
  globalStore.__sitecraftQuotes.unshift(quote);
  return quote;
}

export function listQuotes() {
  return globalStore.__sitecraftQuotes;
}
