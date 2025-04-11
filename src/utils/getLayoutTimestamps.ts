export const getLayoutTimestamps = (
  startTimestamp: `${string}Z`,
  endTimestamp: `${string}Z`
) => {
  const timestamps: { minEnd: string; maxEnd: string }[] = [];
  const intervalSize = 12;

  const currentTimestamp = new Date(startTimestamp);
  const parsedEnd = new Date(endTimestamp);

  while (currentTimestamp < parsedEnd) {
    const minEnd = currentTimestamp.toISOString();

    currentTimestamp.setHours(currentTimestamp.getHours() + intervalSize);
    const hourDifference =
      (parsedEnd.getTime() - currentTimestamp.getTime()) / (1000 * 60 * 60);

    if (hourDifference <= 6) currentTimestamp.setTime(parsedEnd.getTime());

    const maxEnd = currentTimestamp.toISOString();
    timestamps.push({ minEnd, maxEnd });
  }

  return timestamps;
};
