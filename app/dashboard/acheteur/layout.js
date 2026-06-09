import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardAcheteurLayoutClient from "./DashboardAcheteurLayoutClient";

export default async function DashboardAcheteurLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ACHETEUR") redirect("/login");

  return (
    <DashboardAcheteurLayoutClient session={session}>
      {children}
    </DashboardAcheteurLayoutClient>
  );
}