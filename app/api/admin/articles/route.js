import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return Response.json({ error: "Unauthorized" }, { status: 401 });

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, titre: true, slug: true, published: true, publishedAt: true, createdAt: true, extrait: true, coverImage: true },
  });
  return Response.json(articles);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { titre, slug, contenu, extrait, coverImage, published } = await req.json();
  if (!titre || !slug || !contenu) return Response.json({ error: "Champs manquants" }, { status: 400 });

  // Vérif slug unique
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) return Response.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });

  const article = await prisma.article.create({
    data: {
      titre, slug, contenu,
      extrait: extrait || null,
      coverImage: coverImage || null,
      published: published || false,
      publishedAt: published ? new Date() : null,
    },
  });
  return Response.json(article);
}