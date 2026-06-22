import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

// Récupère la session ou redirige vers /login
export async function requireUser(role) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (role && session.user.role !== role) redirect("/dashboard");
  return session.user;
}

// Récupère le Client (promoteur) lié au user connecté.
// Renvoie directement l'objet Client (avec user.email inclus), ou redirige si absent.
export async function getCurrentClient() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { email: true } } },
  });
  if (!client) redirect("/login");
  return client;
}