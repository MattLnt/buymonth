export const CLIENT_NAV = [
  { href: "/dashboard/client", label: "Tableau de bord", short: "Accueil", icon: "home" },
  { href: "/dashboard/client/biens", label: "Mes biens", short: "Biens", icon: "building" },
  {
    section: "Widgets",
    items: [
      { href: "/dashboard/client/widgets", label: "Générer un widget", short: "Widgets", icon: "code" },
      { href: "/dashboard/client/widgets/paiements", label: "Historique des paiements", short: "Paiements", icon: "card" },
    ],
  },
  { href: "/dashboard/client/leads", label: "Mes leads", short: "Leads", icon: "users" },
  { href: "/dashboard/client/abonnement", label: "Abonnement", short: "Abo", icon: "inbox" },
  { href: "/dashboard/client/profil", label: "Profil", short: "Profil", icon: "settings" },
];

export const ADMIN_NAV = [
  { href: "/dashboard/admin", label: "Vue d'ensemble", short: "Accueil", icon: "home" },
  { href: "/dashboard/admin/clients", label: "Clients", short: "Clients", icon: "users" },
  { href: "/dashboard/admin/biens", label: "Tous les biens", short: "Biens", icon: "building" },
  { href: "/dashboard/admin/leads", label: "Tous les leads", short: "Leads", icon: "inbox" },
  { href: "/dashboard/admin/parametres", label: "Paramètres", short: "Réglages", icon: "settings" },
];