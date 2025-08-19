export const getLayoutTimestamps = (
  startTimestamp: string | undefined,
  endTimestamp: string | undefined
) => {
  if (!startTimestamp || !endTimestamp) return [];
  const timestamps: { minEnd: string; maxEnd: string }[] = [];
  const intervalSize = 12;

  const currentTimestamp = new Date(startTimestamp);
  const parsedEnd = new Date(endTimestamp);

  while (currentTimestamp < parsedEnd) {
    const minEnd = currentTimestamp.toISOString();

    currentTimestamp.setUTCHours(currentTimestamp.getUTCHours() + intervalSize);
    const hourDifference =
      (parsedEnd.getTime() - currentTimestamp.getTime()) / (1000 * 60 * 60);

    if (hourDifference <= 6) currentTimestamp.setTime(parsedEnd.getTime());

    const maxEnd = currentTimestamp.toISOString();
    timestamps.push({ minEnd, maxEnd });
  }

  return timestamps;
};

export const getClosestNextTimestamp = (
  date: Date,
  startHour: number = 6,
  intervalSize: number = 12
) => {
  const result = new Date(date);

  const dayStart = new Date(result);
  dayStart.setUTCHours(0, 0, 0, 0);

  const firstSlot = new Date(dayStart);
  firstSlot.setUTCHours(startHour, 0, 0, 0);

  if (result < firstSlot) {
    return firstSlot;
  }

  const diffHours = (result.getTime() - firstSlot.getTime()) / (1000 * 60 * 60);
  const intervalsPassed = Math.floor(diffHours / intervalSize);

  const nextSlot = new Date(firstSlot);
  nextSlot.setUTCHours(
    firstSlot.getUTCHours() + (intervalsPassed + 1) * intervalSize
  );

  return nextSlot;
};

export const getSmartLayoutTimestamps = (
  startTimestamp: string | undefined,
  endTimestamp: string | undefined,
  startOffsetHours: number = 0,
  endOffsetHours: number = 0
) => {
  if (!startTimestamp || !endTimestamp) return [];
  const cutoffs: string[] = [];

  let currentTimestamp = new Date(startTimestamp);
  const parsedEnd = new Date(endTimestamp);

  while (currentTimestamp < parsedEnd) {
    const minEnd = currentTimestamp.toISOString();
    cutoffs.push(minEnd);
    currentTimestamp = getClosestNextTimestamp(currentTimestamp);
  }

  if (cutoffs.length >= 3) {
    const startCutoffDate = new Date(cutoffs[1]);
    startCutoffDate.setUTCHours(
      startCutoffDate.getUTCHours() + startOffsetHours
    );
    cutoffs[1] = startCutoffDate.toISOString();
    const endCutoffDate = new Date(cutoffs[cutoffs.length - 1]);
    endCutoffDate.setUTCHours(endCutoffDate.getUTCHours() + endOffsetHours);
    cutoffs[cutoffs.length - 1] = endCutoffDate.toISOString();
  }

  const timestamps: { minEnd: string; maxEnd: string }[] = cutoffs.map(
    (cutoff, index) => ({
      minEnd: cutoff,
      maxEnd: cutoffs[index + 1] || endTimestamp,
    })
  );

  return timestamps;
};
