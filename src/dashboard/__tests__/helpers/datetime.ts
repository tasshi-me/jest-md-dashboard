export const testStartTime = new Date(2020, 7, 10, 15, 34, 45, 56);
export const testEndTime = new Date(2020, 7, 10, 15, 35, 46, 0);
export const testDuration =
  (testEndTime.getTime() - testStartTime.getTime()) / 1000;
