export const resolveIconSize = (
  val: number | string | undefined,
  defaultVal?: number | string,
): number | string | undefined => {
  if (val === undefined) return defaultVal;
  if (typeof val === 'number') {
    return val < 16 ? val * 4 : val;
  }
  if (typeof val === 'string') {
    if (!isNaN(Number(val))) {
      const num = Number(val);
      return num < 16 ? num * 4 : num;
    }
    return val;
  }
  return val;
};
