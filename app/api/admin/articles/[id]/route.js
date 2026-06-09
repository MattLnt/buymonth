import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return Response.json({ error: "Introuvable" }, { status: 404 });
  return Response.json(article);
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { titre, slug, contenu, extrait, coverImage, published } = await req.json();

  const existing = await prisma.article.findFirst({ where: { slug, NOT: { id } } });
  if (existing) return Response.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });

  const current = await prisma.article.findUnique({ where: { id } });
  const publishedAt = published && !current.published ? new Date() : current.publishedAt;

  const article = await prisma.article.update({
    where: { id },
    data: { titre, slug, contenu, extrait: extrait || null, coverImage: coverImage || null, published, publishedAt },
  });
  return Response.json(article);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return Response.json({ success: true });
}