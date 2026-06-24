export const CLIENT_NAV = [
  {
    section: "Pilotage",
    items: [
      { href: "/dashboard/client", label: "Tableau de bord", short: "Accueil", icon: "home" },
      { href: "/dashboard/client/leads", label: "Mes leads", short: "Leads", icon: "users" },
    ],
  },
  {
    section: "Portefeuille",
    items: [
      { href: "/dashboard/client/biens", label: "Mes biens", short: "Biens", icon: "building" },
      { href: "/dashboard/client/biens/nouveau", label: "Ajouter un bien", short: "Ajouter", icon: "plus" },
    ],
  },
  {
    section: "Widgets",
    items: [
      { href: "/dashboard/client/widgets", label: "Générer un widget", short: "Widgets", icon: "code" },
      { href: "/dashboard/client/widgets/paiements", label: "Historique des paiements", short: "Paiements", icon: "card" },
    ],
  },
  {
    section: "Mon compte",
    items: [
      { href: "/dashboard/client/abonnement", label: "Abonnement", short: "Abo", icon: "card" },
      { href: "/dashboard/client/profil", label: "Profil", short: "Profil", icon: "settings" },
    ],
  },
];

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