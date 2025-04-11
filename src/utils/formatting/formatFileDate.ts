export const formatFileDate = (date: Date) => {
  return date
    .toLocaleDateString("de", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
    .replace("., ", "-")
    .replace(".", "-")
    .replace(".", "-");
};
