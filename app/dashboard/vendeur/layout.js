import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardVendeurLayoutClient from "./DashboardVendeurLayoutClient";

export default async function DashboardVendeurLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "VENDEUR") redirect("/login");

  return (
    <DashboardVendeurLayoutClient session={session}>
      {children}
    </DashboardVendeurLayoutClient>
  );
}