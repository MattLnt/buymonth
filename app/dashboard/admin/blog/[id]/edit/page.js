import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ArticleForm from "../../ArticleForm";

export default async function EditArticlePage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) redirect("/dashboard/admin/blog");

  return <ArticleForm article={article} />;
}