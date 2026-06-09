"use client";
import { useEffect } from "react";

export default function VueTracker({ opportuniteIds, isAbonne }) {
  useEffect(() => {
    if (!opportuniteIds || opportuniteIds.length === 0) return;
    // On n'incrémente les vues publiques que pour les non-abonnés
    // Les vues abonnés sont incrémentées côté serveur sur la page détail
    if (!isAbonne) {
      opportuniteIds.forEach(id => {
        fetch(`/api/opportunites/${id}/vue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      });
    }
  }, []);
  return null;
}