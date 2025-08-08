export const formatShortTime = (date: Date) => {
  return date.toLocaleTimeString("de", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimeAlt = (date: Date) => `${date.getHours()} Uhr`;
