import { makeT } from "@/lib/i18n/config";

// Menu promoteur, traduit selon la langue (lang = 'fr' | 'nl').
export function clientNav(lang = "fr") {
  const t = makeT(lang);
  return [
    {
      key: "pilotage",
      section: t("Pilotage", "Overzicht"),
      items: [
        { href: "/dashboard/client", label: t("Tableau de bord", "Dashboard"), short: t("Accueil", "Home"), icon: "home" },
        { href: "/dashboard/client/leads", label: t("Mes leads", "Mijn leads"), short: "Leads", icon: "users" },
      ],
    },
    {
      key: "portefeuille",
      section: t("Portefeuille", "Portefeuille"),
      items: [
        { href: "/dashboard/client/biens", label: t("Mes biens", "Mijn panden"), short: t("Biens", "Panden"), icon: "building" },
        { href: "/dashboard/client/biens/nouveau", label: t("Ajouter un bien", "Pand toevoegen"), short: t("Ajouter", "Toevoegen"), icon: "plus" },
      ],
    },
    {
      key: "widgets",
      section: "Widgets",
      items: [
        { href: "/dashboard/client/widgets", label: t("Générer un widget", "Widget aanmaken"), short: "Widgets", icon: "code" },
        { href: "/dashboard/client/widgets/paiements", label: t("Historique des paiements", "Betalingsoverzicht"), short: t("Paiements", "Betalingen"), icon: "card" },
      ],
    },
    {
      key: "compte",
      section: t("Mon compte", "Mijn account"),
      items: [
        { href: "/dashboard/client/abonnement", label: t("Abonnement", "Abonnement"), short: t("Abo", "Abo"), icon: "card" },
        { href: "/dashboard/client/profil", label: t("Profil", "Profiel"), short: t("Profil", "Profiel"), icon: "settings" },
      ],
    },
  ];
}

export const CLIENT_NAV = clientNav("fr");

// Ajoute au menu promoteur les entrees que BuyMonth a ouvertes sur son compte
export function navCommerciaux(lang = "fr") {
  const t = makeT(lang);
  return { href: "/dashboard/client/commerciaux", label: t("Mes commerciaux", "Mijn verkopers"), short: t("Commerciaux", "Verkopers"), icon: "users" };
}
export const NAV_COMMERCIAUX = navCommerciaux("fr");

export function navPromoteur({ routageActif } = {}, lang = "fr") {
  const nav = clientNav(lang);
  if (!routageActif) return nav;
  return nav.map((s) =>
    s.key === "compte" ? { ...s, items: [navCommerciaux(lang), ...s.items] } : s,
  );
}

export const ADMIN_NAV = [
  {
    section: "Pilotage",
    items: [
      { href: "/dashboard/admin", label: "Vue d'ensemble", short: "Accueil", icon: "home" },
      { href: "/dashboard/admin/revenus", label: "Revenus", short: "Revenus", icon: "euro" },
    ],
  },
  {
    section: "Gestion",
    items: [
      { href: "/dashboard/admin/clients", label: "Promoteurs", short: "Promoteurs", icon: "users" },
      { href: "/dashboard/admin/biens", label: "Tous les biens", short: "Biens", icon: "building" },
      { href: "/dashboard/admin/leads", label: "Tous les leads", short: "Leads", icon: "inbox" },
    ],
  },
  {
    section: "Plateforme",
    items: [
      { href: "/biens", label: "Catalogue public", short: "Catalogue", icon: "eye" },
    ],
  },
  {
    section: "Configuration",
    items: [
      { href: "/dashboard/admin/parametres", label: "Paramètres", short: "Réglages", icon: "settings" },
    ],
  },
];