const options: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Berlin",
};

export const germanTimeFormatter = new Intl.DateTimeFormat("de-DE", options);

export const formatShortTime = (date: Date) => {
  return germanTimeFormatter.format(date);
};

export const formatTimeAlt = (date: Date) => `${date.getHours()} Uhr`;
