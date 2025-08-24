export const lowerSanitize = (value: string) => {
  return value.toLowerCase().replace(/[\W_]+/g, "-");
};
