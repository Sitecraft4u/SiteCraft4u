const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export function apiFetch(path, options = {}) {
  return fetch(apiUrl(path), {
    credentials: "include",
    ...options,
  });
}
