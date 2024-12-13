import { PeriodEnum } from './filter.dto';

export const getStartDate = (
  date: Date,
  period: PeriodEnum,
): { startDate: Date; endDate: Date } => {
  let startDate: Date;
  let endDate: Date;
  if (period === PeriodEnum.WEEKLY) {
    // Start of the current week (Sunday)
    startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    startDate.setHours(0, 0, 0, 0);

    // End of the current week (Saturday)
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Saturday
    endDate.setHours(23, 59, 59, 999);
  } else if (period === PeriodEnum.DAILY) {
    // Start of the current day
    startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // End of the current day
    endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

export const generateDateRange = (
  startDate: Date,
  endDate: Date,
  unit: 'day' | 'hour',
): Date[] => {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    if (unit === 'day') {
      current.setDate(current.getDate() + 1);
    } else {
      current.setHours(current.getHours() + 1);
    }
  }

  return dates;
};
