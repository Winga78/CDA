export const formatModifiedDate = (modifiedAt: string): string => {
  // Sécurise le format pour Date()
  const safeDateStr = modifiedAt.replace(" ", "T");
  const modifiedDate = new Date(safeDateStr);
  const now = new Date();

  if (isNaN(modifiedDate.getTime())) {
    return "Date invalide";
  }

  const diffInMs = now.getTime() - modifiedDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);

  if (diffInMinutes < 1) {
    return "Now";
  } else if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  } else if (diffInHours < 24) {
    return `Aujourd'hui à ${modifiedDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  } else {
    return modifiedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
};
