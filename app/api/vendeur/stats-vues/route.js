import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "30d";

    const vendeur = await prisma.vendeur.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!vendeur) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });

    const opportunites = await prisma.opportunite.findMany({
      where: { vendeurId: vendeur.id },
      select: { id: true, vuesPubliques: true, vuesAbonnes: true, createdAt: true },
    });
    const oppIds = opportunites.map(o => o.id);

    const now = new Date();
    let startDate;
    let groupBy;

    if (filter === "7d") {
      startDate = new Date(now); startDate.setDate(now.getDate() - 7); groupBy = "day";
    } else if (filter === "30d") {
      startDate = new Date(now); startDate.setDate(now.getDate() - 30); groupBy = "day";
    } else if (filter === "6m") {
      startDate = new Date(now); startDate.setMonth(now.getMonth() - 6); groupBy = "week";
    } else {
      startDate = new Date(now); startDate.setFullYear(now.getFullYear() - 1); groupBy = "month";
    }

    // Génère tous les points de la période avec valeur 0
    function generateEmptySeries() {
      const map = new Map();
      const cursor = new Date(startDate);
      while (cursor <= now) {
        let key;
        if (groupBy === "day") {
          key = cursor.toLocaleDateString("fr-BE", { day: "numeric", month: "short" });
          cursor.setDate(cursor.getDate() + 1);
        } else if (groupBy === "week") {
          key = `S${getWeek(cursor)}`;
          cursor.setDate(cursor.getDate() + 7);
        } else {
          key = cursor.toLocaleDateString("fr-BE", { month: "short", year: "2-digit" });
          cursor.setMonth(cursor.getMonth() + 1);
        }
        if (!map.has(key)) map.set(key, 0);
      }
      return map;
    }

    function getWeek(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
      const week1 = new Date(d.getFullYear(), 0, 4);
      return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    }

    function dateToKey(d) {
      if (groupBy === "day") return d.toLocaleDateString("fr-BE", { day: "numeric", month: "short" });
      if (groupBy === "week") return `S${getWeek(d)}`;
      return d.toLocaleDateString("fr-BE", { month: "short", year: "2-digit" });
    }

    function mapToArray(map) {
      return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
    }

    if (oppIds.length === 0) {
      const empty = mapToArray(generateEmptySeries());
      return NextResponse.json({ vuesPubliques: empty, vuesAbonnes: empty, deblocages: empty });
    }

    // Essaie de lire depuis VueOpportunite (nouveau log)
    const vuesLoggees = await prisma.vueOpportunite.findMany({
      where: {
        opportuniteId: { in: oppIds },
        date: { gte: startDate },
      },
      select: { type: true, date: true },
      orderBy: { date: "asc" },
    });

    const deblocages = await prisma.deblocage.findMany({
      where: {
        opportuniteId: { in: oppIds },
        paidAt: { gte: startDate, not: null },
      },
      select: { paidAt: true },
      orderBy: { paidAt: "asc" },
    });

    // Totaux compteurs DB
    const totalPubliques = opportunites.reduce((acc, o) => acc + (o.vuesPubliques || 0), 0);
    const totalAbonnes = opportunites.reduce((acc, o) => acc + (o.vuesAbonnes || 0), 0);

    // Si pas de logs => fallback : on place le total sur aujourd'hui
    const hasLogsPubliques = vuesLoggees.some(v => v.type === "publique");
    const hasLogsAbonnes = vuesLoggees.some(v => v.type === "abonne");

    function buildSeriesFromLogs(items, dateField) {
      const map = generateEmptySeries();
      items.forEach(item => {
        const key = dateToKey(new Date(item[dateField]));
        if (map.has(key)) map.set(key, map.get(key) + 1);
      });
      return mapToArray(map);
    }

    function buildFallbackSeries(total) {
      const map = generateEmptySeries();
      // Place le total sur le dernier point (aujourd'hui)
      const todayKey = dateToKey(now);
      if (map.has(todayKey)) {
        map.set(todayKey, total);
      } else {
        // Prend le dernier point disponible
        const keys = Array.from(map.keys());
        if (keys.length > 0) map.set(keys[keys.length - 1], total);
      }
      return mapToArray(map);
    }

    const vuesPubliquesData = hasLogsPubliques
      ? buildSeriesFromLogs(vuesLoggees.filter(v => v.type === "publique"), "date")
      : totalPubliques > 0
        ? buildFallbackSeries(totalPubliques)
        : mapToArray(generateEmptySeries());

    const vuesAbonnesData = hasLogsAbonnes
      ? buildSeriesFromLogs(vuesLoggees.filter(v => v.type === "abonne"), "date")
      : totalAbonnes > 0
        ? buildFallbackSeries(totalAbonnes)
        : mapToArray(generateEmptySeries());

    const deblocagesData = buildSeriesFromLogs(deblocages, "paidAt");

    return NextResponse.json({
      vuesPubliques: vuesPubliquesData,
      vuesAbonnes: vuesAbonnesData,
      deblocages: deblocagesData,
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}