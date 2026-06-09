"use client";
import { usePathname } from "next/navigation";
import PublicBottomNav from "./PublicBottomNav";

export default function PublicBottomNavWrapper() {
  const pathname = usePathname();
  const hidden = ["/dashboard", "/login", "/register"];
  if (hidden.some(p => pathname.startsWith(p))) return null;
  return <PublicBottomNav />;
}