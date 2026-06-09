import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardVendeurContent from "./DashboardVendeurContent";

export default async function DashboardVendeurPage() {
  const session = await getServerSession(authOptions);

  const vendeur = await prisma.vendeur.findUnique({
    where: { userId: session.user.id },
    include: {
      opportunites: {
        include: {
          deblocages: {
            where: { paidAt: { not: null } },
            include: {
              acheteur: { include: { user: { select: { email: true } } } },
            },
            orderBy: { paidAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const opportunites = vendeur?.opportunites || [];

  // Totaux globaux
  const totalVuesPubliques = opportunites.reduce((acc, o) => acc + (o.vuesPubliques || 0), 0);
  const totalVuesAbonnes = opportunites.reduce((acc, o) => acc + (o.vuesAbonnes || 0), 0);
  const totalDeblocages = opportunites.reduce((acc, o) => acc + o.deblocages.length, 0);

  // Liste acheteurs potentiels (tous les déblocages payés)
  const acheteursPotentiels = opportunites.flatMap(o =>
    o.deblocages.map(d => ({
      id: d.id,
      email: d.acheteur.user.email,
      paidAt: d.paidAt,
      opportuniteProvince: o.province,
      opportuniteId: o.id,
      packCommission: d.packCommission,
    }))
  ).sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  return (
    <DashboardVendeurContent
      opportunites={opportunites}
      session={session}
      totalVuesPubliques={totalVuesPubliques}
      totalVuesAbonnes={totalVuesAbonnes}
      totalDeblocages={totalDeblocages}
      acheteursPotentiels={acheteursPotentiels}
    />
  );
}