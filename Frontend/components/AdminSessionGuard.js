"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { apiFetch } from "../lib/api";

const PENDING_KEY = "sitecraft_admin_auto_logout_pending";

export default function AdminSessionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
      sessionStorage.removeItem(PENDING_KEY);
      return;
    }

    const pending = sessionStorage.getItem(PENDING_KEY) === "1";
    if (!pending) return;

    apiFetch("/api/admin/logout", {
      method: "POST",
      keepalive: true,
    }).catch(() => {});

    sessionStorage.removeItem(PENDING_KEY);
  }, [pathname]);

  return null;
}
