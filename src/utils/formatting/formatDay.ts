export const formatDay = (value: string) => {
  const date = new Date(value);

  return `${date.toLocaleDateString("de", {
    weekday: "long",
  })}, ${date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
  })}`;
};
