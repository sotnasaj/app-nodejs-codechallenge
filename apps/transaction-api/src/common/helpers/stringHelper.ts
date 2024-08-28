export const stringToArray = (input: string): string[] => {
  return input
    .trim()
    .split(',')
    .map((item) => item.trim());
};
