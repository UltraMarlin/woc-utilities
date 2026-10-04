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

export const formatTimestampInGermany = (dateString?: string) =>
  dateString
    ? germanTimeFormatter.format(new Date(dateString + "+02:00"))
    : dateString;

export const getGermanTimestamp = (offsetSeconds = 0) =>
  new Date(Date.now() + offsetSeconds * 1000)
    .toLocaleString("sv-SE", { timeZone: "Europe/Berlin" })
    .replace(" ", "T");

export const formatTimeAlt = (date: Date) => `${date.getHours()} Uhr`;
