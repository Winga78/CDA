export const formatModifiedDate = (modifiedAt: string): string => {
    const modifiedDate = new Date(modifiedAt);
    const now = new Date();
  
    // Vérifie si la différence est d'1 minute ou moins
    const diffInMinutes = Math.floor((now.getTime() - modifiedDate.getTime()) / 60000);
    if (diffInMinutes <= 1) {
      return "Now";
    }
  
    // Format : Jour Mois Année (ex: 26 Mar 2025)
    return modifiedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  